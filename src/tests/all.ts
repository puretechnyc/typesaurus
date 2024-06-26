import sinon from "sinon";
import { beforeEach, describe, expect, it, afterEach } from "vitest";
import { groups, schema, Typesaurus } from "..";

describe("all", () => {
  interface Book {
    title: string;
  }

  interface Order {
    book: Typesaurus.Ref<Book, "books">;
    quantity: number;
    date?: Date;
    lastUpdate?: Typesaurus.Ref<Update, "updates", "orders/updates">;
  }

  interface Update {
    location: string;
  }

  const db = schema(($) => ({
    books: $.collection<Book>(),
    orders: $.collection<Order>().sub({
      updates: $.collection<Update>(),
    }),
  }));

  beforeEach(async () => {
    await Promise.all([
      db.books.set(db.books.id("sapiens"), { title: "Sapiens" }),
      db.books.set(db.books.id("22laws"), {
        title: "The 22 Immutable Laws of Marketing",
      }),
      db.books.set(db.books.id("momtest"), { title: "The Mom Test" }),
      db.books.remove(db.books.id("hp1")),
      db.books.remove(db.books.id("hp2")),
    ]);
  });

  it("allows to assert environment", async () => {
    const server = () => db.books.all({ as: "server" });
    const client = () => db.books.all({ as: "client" });

    if (typeof window === "undefined") {
      await server();
      expect(client).toThrowError("Expected client environment");
    } else {
      await client();
      expect(server).toThrowError("Expected server environment");
    }
  });

  describe("promise", () => {
    it("returns all documents in a collection", async () => {
      const docs = await db.books.all();
      expect(docs.map(({ data: { title } }) => title).sort()).toEqual([
        "Sapiens",
        "The 22 Immutable Laws of Marketing",
        "The Mom Test",
      ]);
    });

    it("expands references", async () => {
      await Promise.all([
        db.orders.set(db.orders.id("order1"), {
          book: db.books.ref(db.books.id("sapiens")),
          quantity: 1,
        }),
        db.orders.set(db.orders.id("order2"), {
          book: db.books.ref(db.books.id("22laws")),
          quantity: 1,
        }),
      ]);
      const docs = await db.orders.all();
      expect(docs[0]?.data.book.type).toBe("ref");
      expect(docs[0]?.data.book.collection.type).toBe("collection");
      expect(docs[0]?.data.book.collection.path).toBe("books");
      const orderedBooks = await Promise.all(
        docs.map((doc) => doc.data.book.get()),
      );
      expect(orderedBooks.map((doc) => doc?.data.title).sort()).toEqual([
        "Sapiens",
        "The 22 Immutable Laws of Marketing",
      ]);
    });

    it("expands dates", async () => {
      const date = new Date(1987, 1, 11);
      await Promise.all([
        db.orders.set(db.orders.id("order1"), {
          book: db.books.ref(db.books.id("sapiens")),
          quantity: 1,
          date,
        }),
        db.orders.set(db.orders.id("order2"), {
          book: db.books.ref(db.books.id("22laws")),
          quantity: 1,
          date,
        }),
      ]);
      const docs = await db.orders.all();
      expect(docs[0]?.data.date?.getTime()).toBe(date.getTime());
      expect(docs[1]?.data.date?.getTime()).toBe(date.getTime());
    });

    describe("subcollection", () => {
      it("works on subcollections", async () => {
        const orderId = await db.orders.id();

        await Promise.all([
          db.orders(orderId).updates.add({ location: "New York" }),
          db.orders(orderId).updates.add({ location: "Singapore" }),
          db.orders(orderId).updates.add({ location: "Prague" }),
        ]);

        const updates = await db.orders(orderId).updates.all();

        expect(updates.map((o) => o.data.location).sort()).toEqual([
          "New York",
          "Prague",
          "Singapore",
        ]);
      });

      it("expands references", async () => {
        const orderId = db.orders.id("order1");

        const updateRef = await db
          .orders(orderId)
          .updates.add({ location: "New York" });

        await db.orders.set(orderId, {
          book: db.books.ref(db.books.id("sapiens")),
          quantity: 1,
          lastUpdate: updateRef,
        });

        const orders = await db.orders.all();
        const order = orders.find(
          (order) => order.ref.id.toString() === "order1",
        );

        expect(order?.data.lastUpdate?.type).toBe("ref");
        expect(order?.data.lastUpdate?.id).toBe(updateRef.id);

        expect(order?.data.lastUpdate?.collection.type).toBe("collection");
        expect(order?.data.lastUpdate?.collection.path).toBe(
          `orders/${orderId}/updates`,
        );
      });
    });

    describe("groups", () => {
      interface Comment {
        text: string;
      }

      const db = schema(($) => ({
        books: $.collection<Book>().sub({
          comments: $.collection<Comment>(),
        }),

        orders: $.collection<Order>().sub({
          comments: $.collection<Comment>(),
          updates: $.collection<Update>(),
        }),
      }));

      afterEach(async () => {
        await groups(db)
          .comments.all()
          .then((docs) => docs.map((doc) => doc.remove()));
      });

      it("allows to get all data from collection groups", async () => {
        await Promise.all([
          db.books(db.books.id("qwe")).comments.add({
            text: "hello",
          }),

          db.books(db.books.id("asd")).comments.add({
            text: "cruel",
          }),

          db.books(db.books.id("zxc")).comments.add({
            text: "world",
          }),
        ]);

        const comments = await groups(db).comments.all();

        expect(comments.map((c) => c.data.text).sort()).toEqual([
          "cruel",
          "hello",
          "world",
        ]);
      });

      it("expands references", async () => {
        await db.orders.set(db.orders.id("order1"), {
          book: db.books.ref(db.books.id("sapiens")),
          quantity: 1,
        });

        const docs = await groups(db).orders.all();

        const order = docs.find(
          (order) => order.ref.id.toString() === "order1",
        );

        expect(order?.data.book.type).toBe("ref");
        expect(order?.data.book.collection.type).toBe("collection");
        expect(order?.data.book.collection.path).toBe("books");
      });
    });
  });

  describe("subscription", () => {
    let off: (() => void) | undefined;

    afterEach(() => {
      off?.();
      off = undefined;
    });

    it("returns all documents in a collection", () =>
      new Promise((resolve) => {
        const spy = sinon.spy();
        off = db.books.all().on((docs) => {
          spy(docs.map(({ data: { title } }) => title).sort());
          if (
            spy.calledWithMatch([
              "Sapiens",
              "The 22 Immutable Laws of Marketing",
              "The Mom Test",
            ])
          )
            resolve(void 0);
        });
      }));

    it("expands references", async () => {
      await Promise.all([
        db.orders.set(db.orders.id("order1"), {
          book: db.books.ref(db.books.id("sapiens")),
          quantity: 1,
        }),
        db.orders.set(db.orders.id("order2"), {
          book: db.books.ref(db.books.id("22laws")),
          quantity: 1,
        }),
      ]);

      return new Promise((resolve) => {
        const spy = sinon.spy();
        off = db.orders.all().on(async (docs) => {
          off?.();
          expect(docs[0]?.data.book.type).toBe("ref");
          expect(docs[0]?.data.book.collection.path).toBe("books");

          const orderedBooks = await Promise.all(
            docs.map((doc) => doc.data.book.get()),
          );
          spy(orderedBooks.map((doc) => doc?.data.title).sort());
          if (
            spy.calledWithMatch([
              "Sapiens",
              "The 22 Immutable Laws of Marketing",
            ])
          )
            resolve(void 0);
        });
      });
    });

    it("expands dates", async () => {
      const date = new Date();
      await Promise.all([
        db.orders.set(db.orders.id("order1"), {
          book: db.books.ref(db.books.id("sapiens")),
          quantity: 1,
          date,
        }),
        db.orders.set(db.orders.id("order2"), {
          book: db.books.ref(db.books.id("22laws")),
          quantity: 1,
          date,
        }),
      ]);

      return new Promise((resolve) => {
        off = db.orders.all().on((docs) => {
          if (docs.length === 2 && docs[0]?.data.date && docs[1]?.data.date) {
            off?.();
            if (typeof window === undefined) {
              expect(docs[0].data.date.getTime()).toBe(date.getTime());
              expect(docs[1].data.date.getTime()).toBe(date.getTime());
            } else {
              // TODO: WTF, Node.js and browser dates are processed differently
              expect(docs[0].data.date.getTime() - date.getTime() < 20000).toBe(
                true,
              );
              expect(docs[1].data.date.getTime() - date.getTime() < 20000).toBe(
                true,
              );
            }
            resolve(void 0);
          }
        });
      });
    });

    describe("subcollection", () => {
      it("works on subcollections", async () => {
        const orderId = await db.orders.id();

        await Promise.all([
          db.orders(orderId).updates.add({ location: "New York" }),
          db.orders(orderId).updates.add({ location: "Singapore" }),
          db.orders(orderId).updates.add({ location: "Prague" }),
        ]);

        return new Promise((resolve) => {
          off = db
            .orders(orderId)
            .updates.all()
            .on((updates) => {
              expect(updates.map((o) => o.data.location).sort()).toEqual([
                "New York",
                "Prague",
                "Singapore",
              ]);
              resolve(void 0);
            });
        });
      });

      it("expands references", async () => {
        const orderId = db.orders.id("order1");

        const updateRef = await db
          .orders(orderId)
          .updates.add({ location: "New York" });

        await db.orders.set(orderId, {
          book: db.books.ref(db.books.id("sapiens")),
          quantity: 1,
          lastUpdate: updateRef,
        });

        return new Promise((resolve) => {
          off = db.orders.all().on((orders) => {
            const order = orders.find(
              (order) => order.ref.id.toString() === "order1",
            );

            expect(order?.data.lastUpdate?.type).toBe("ref");
            expect(order?.data.lastUpdate?.id).toBe(updateRef.id);

            expect(order?.data.lastUpdate?.collection.type).toBe("collection");
            expect(order?.data.lastUpdate?.collection.path).toBe(
              `orders/${orderId}/updates`,
            );
            resolve(void 0);
          });
        });
      });
    });

    describe("groups", () => {
      interface Comment {
        text: string;
      }

      const db = schema(($) => ({
        books: $.collection<Book>().sub({
          comments: $.collection<Comment>(),
        }),

        orders: $.collection<Order>().sub({
          comments: $.collection<Comment>(),
          updates: $.collection<Update>(),
        }),
      }));

      afterEach(async () => {
        await groups(db)
          .comments.all()
          .then((docs) => docs.map((doc) => doc.remove()));
      });

      it("allows to get all data from collection groups", async () => {
        await Promise.all([
          db.books(db.books.id("qwe")).comments.add({
            text: "hello",
          }),

          db.books(db.books.id("asd")).comments.add({
            text: "cruel",
          }),

          db.books(db.books.id("zxc")).comments.add({
            text: "world",
          }),
        ]);

        return new Promise((resolve) => {
          off = groups(db)
            .comments.all()
            .on((comments) => {
              if (comments.length === 3) {
                off?.();
                expect(comments.map((c) => c.data.text).sort()).toEqual([
                  "cruel",
                  "hello",
                  "world",
                ]);
                resolve(void 0);
              }
            });
        });
      });

      it("expands references", async () => {
        await db.orders.set(db.orders.id("order1"), {
          book: db.books.ref(db.books.id("sapiens")),
          quantity: 1,
        });

        return new Promise((resolve) => {
          off = groups(db)
            .orders.all()
            .on((docs) => {
              off?.();

              const order = docs.find(
                (order) => order.ref.id.toString() === "order1",
              );

              expect(order?.data.book.type).toBe("ref");
              expect(order?.data.book.collection.type).toBe("collection");
              expect(order?.data.book.collection.path).toBe("books");

              resolve(void 0);
            });
        });
      });
    });

    describe("empty", () => {
      it("should notify with values all indicate empty", () =>
        new Promise((resolve) => {
          const db = schema(($) => ({ void: $.collection() }));

          off = db.void.all().on((docs, { changes, empty }) => {
            expect(empty).toBeTruthy();
            expect(docs.length).toBe(0);
            expect(changes().length).toBe(0);
            resolve(void 0);
          });
        }));
    });

    describe("real-time", () => {
      it("subscribes to updates", () =>
        new Promise((resolve) => {
          let c = 0;
          off = db.books.all().on(async (docs, { changes }) => {
            const titles = docs.map(({ data: { title } }) => title).sort();
            const docChanges = changes()
              .map(
                ({
                  type,
                  doc: {
                    data: { title },
                  },
                }) => ({ type, title }),
              )
              .sort((a, b) => a.title.localeCompare(b.title));

            switch (++c) {
              case 1:
                expect(titles).toEqual([
                  "Sapiens",
                  "The 22 Immutable Laws of Marketing",
                  "The Mom Test",
                ]);
                expect(docChanges).toEqual([
                  { type: "added", title: "Sapiens" },
                  {
                    type: "added",
                    title: "The 22 Immutable Laws of Marketing",
                  },
                  { type: "added", title: "The Mom Test" },
                ]);
                await db.books.set(db.books.id("hp1"), {
                  title: "Harry Potter and the Sorcerer's Stone",
                });
                return;

              case 2:
                expect(titles).toEqual([
                  "Harry Potter and the Sorcerer's Stone",
                  "Sapiens",
                  "The 22 Immutable Laws of Marketing",
                  "The Mom Test",
                ]);
                expect(docChanges).toEqual([
                  {
                    type: "added",
                    title: "Harry Potter and the Sorcerer's Stone",
                  },
                ]);
                resolve(void 0);
            }
          });
        }));

      // TODO: WTF browser Firebase returns elements gradually unlike Node.js version.
      // if (typeof window === undefined) {
      it("returns function that unsubscribes from the updates", () =>
        new Promise(async (resolve) => {
          const spy = sinon.spy();
          const on = () => {
            off = db.books.all().on((docs) => {
              const titles = docs.map(({ data: { title } }) => title).sort();
              spy(titles);
              if (titles.length === 5) {
                off?.();
                expect(
                  spy.neverCalledWithMatch([
                    "Harry Potter and the Sorcerer's Stone",
                    "Sapiens",
                    "The 22 Immutable Laws of Marketing",
                    "The Mom Test",
                  ]),
                ).toBe(true);
                expect(
                  spy.calledWithMatch([
                    "Harry Potter and the Chamber of Secrets",
                    "Harry Potter and the Sorcerer's Stone",
                    "Sapiens",
                    "The 22 Immutable Laws of Marketing",
                    "The Mom Test",
                  ]),
                ).toBe(true);
                resolve(void 0);
              }
            });
          };
          on();
          off?.();
          await db.books.set(db.books.id("hp1"), {
            title: "Harry Potter and the Sorcerer's Stone",
          });
          await db.books.set(db.books.id("hp2"), {
            title: "Harry Potter and the Chamber of Secrets",
          });
          on();
        }));
      // }
    });
  });

  describe("request", () => {
    it("exposes the request", () => {
      const promise = db.books.all();
      expect(promise.request).toEqual(
        expect.objectContaining({
          type: "request",
          kind: "all",
          path: "books",
        }),
      );
    });

    it("exposes a group request", () => {
      const promise = groups(db).books.all();
      expect(promise.request).toEqual(
        expect.objectContaining({
          type: "request",
          kind: "all",
          path: "books",
          group: true,
        }),
      );
    });
  });
});
