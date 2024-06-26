// NOTE: That this file is used to generate tysts for different environments,
// including loose that is located next to this file (see ./loose/core.ts).
// To do that, we use @tysts-start and @tysts-end comments.

// @tysts-start: strict
import { schema, Typesaurus } from "..";
import type { TypesaurusCore as Core, TypesaurusCore } from "../types/core";
import type { TypesaurusUtils as Utils } from "../types/utils";
// @tysts-end: strict
/* @tysts-start: loose
import { schema, Typesaurus } from '../..'
import type { TypesaurusCore as Core } from '../../types/core'
import type { TypesaurusUtils as Utils } from '../../types/utils'
@tysts-end: loose */

interface SharedFields {
  active: boolean;
}

interface Post extends SharedFields {
  title: string;
  text: string;
  likeIds?: string[];
  likes?: number;
  tags?: Array<string | undefined>;
}

interface Comment {
  text: string;
  author: string | null;
}

interface PostLike extends Like {
  comment: string;
}

interface Like {
  userId: string;
}

interface Account {
  name: string;
  createdAt: Typesaurus.ServerDate;

  contacts: {
    email: string;
    phone?: string;
  };

  emergencyContacts?: {
    name: string;
    phone: string;
    email?: string;
  };

  nested1Required: {
    nested12Required: {
      hello: string;
      world?: string;
    };
  };

  nested1Optional?: {
    required12: string;
    nested12Optional?: {
      hello: string;
      world?: string;
    };
  };

  counters: {
    [postId: string]: { likes?: number };
  };

  nested?: {
    counters?: {
      [postId: PostId]: {
        likes: number;
      };
    };
  };
}

type PostId = string & { __dontUseWillBeUndefined__: "post" };

interface User {
  name: string;
  contacts:
    | {
        email: string;
        phone?: string;
      }
    | {
        country: string;
        city: string;
      }
    | {
        zip: string[];
      }
    | {
        address:
          | {
              zip: string;
            }
          | {
              line: string;
            };
      }
    | {
        no: number;
      };
  birthdate?: Date;
  alias?: string | undefined;
  status: string | undefined;
  // Allow setting only server date on client,
  // but allow on server
  createdAt: Typesaurus.ServerDate;
  updatedAt?: Typesaurus.ServerDate | undefined;
}

interface Organization {
  counters?: {
    drafts: number;
    scheduled: number;
    published: number;
  };
}

interface TextContent extends SharedFields {
  type: "text";
  text: string;
  public?: boolean | undefined;
}

interface ImageContent extends SharedFields {
  type: "image";
  src: string;
  public?: boolean;
}

interface AppStats {
  users: number;
}

interface WithJSON {
  str: OpaqueJSON;
  version: OpaqueNumber;
}

interface Address {
  title: string;
  address?: {
    city?: string;
    lines?: string[];
  };
  addresses: string[];
}

interface Mixed {
  record: Record<OpaqueString, string>;
  nestedRecord: {
    record: Record<OpaqueString, string>;
  };
  idRecord: Record<Typesaurus.Id<"hello">, number>;
  nestedIdRecord: {
    idRecord: Record<Typesaurus.Id<"hello">, number>;
  };
  date1: Date;
  date2: Date | undefined;
  date3?: Date;
  date4?: Date | undefined;
  serverDate1: Typesaurus.ServerDate;
  serverDate2: Typesaurus.ServerDate | undefined;
  serverDate3?: Typesaurus.ServerDate;
  serverDate4?: Typesaurus.ServerDate | undefined;
  array1: string[];
  array2: string[] | undefined;
  array3?: string[];
  array4?: string[] | undefined;
  arrayWithUndefined1: (string | undefined)[];
  arrayWithUndefined2: (string | undefined)[] | undefined;
  arrayWithUndefined3?: (string | undefined)[];
  arrayWithUndefined4?: (string | undefined)[] | undefined;
  number1: number;
  number2: number | undefined;
  number3?: number;
  number4?: number | undefined;
  string1: string;
  string2: string | undefined;
  string3?: string;
  string4?: string | undefined;
  boolean1: boolean;
  boolean2: boolean | undefined;
  boolean3?: boolean;
  boolean4?: boolean | undefined;
  object1: { hello: string };
  object2: { hello: string } | undefined;
  object3?: { hello: string };
  object4?: { hello: string } | undefined;
  union1: string | number;
  union2: string | number | undefined;
  union3?: string | number;
  union4?: string | number | undefined;
  nested1: Mixed;
  nested2: Mixed | undefined;
  nested3?: Mixed;
  nested4?: Mixed | undefined;
  arrayOfObjects: Array<{
    date?: Date;
    some?: "things";
    things?: "some" | undefined;
    opaqueNumber: OpaqueNumber;
    opaqueString: OpaqueString;
    opaqueBoolean: OpaqueBoolean;
  }>;
}

type OpaqueJSON = string & { __json: {} };

type OpaqueNumber = number & { __number: 123 };

type OpaqueString = string & { __string: "hello" };

type OpaqueBoolean = boolean & { __boolean: true };

interface OpaqueTypes {
  number: OpaqueNumber;
  numberArr: OpaqueNumber[];
  string: OpaqueString;
  stringArr: OpaqueString[];
  boolean: OpaqueBoolean;
  booleanArr: OpaqueBoolean[];
  object: {
    number: OpaqueNumber;
    string: OpaqueString;
    boolean: OpaqueBoolean;
  };
  array: Array<{
    number: OpaqueNumber;
    string: OpaqueString;
    boolean: OpaqueBoolean;
  }>;
}

interface CustomCollection {
  hello: "world";
}

const customCollection = "customCollectionName";

interface GitHubAccount extends SharedFields {
  type: "github";
  userId: string;
}

interface MicrosoftAccount extends SharedFields {
  type: "microsoft";
  accountId: string;
}

interface GoogleAccount extends SharedFields {
  type: "google";
  email: string;
}

export type VarUser = [UserAnonymous, UserActive];

export interface UserAnonymous {
  anonymous: true;
}

export interface UserActive {
  anonymous: false;
  emailVerified: boolean;
  email: string;
}

interface Book {
  name: string;
  author: string;
}

// Flat schema
const db = schema(
  ($) => ({
    users: $.collection<User>().sub({
      books: $.collection<Book>(),
    }),
    posts: $.collection<Post>(),
    accounts: $.collection<Account>(),
    organizations: $.collection<Organization>(),
    content: $.collection<[TextContent, ImageContent]>(),
    appStats: $.collection<AppStats, "appStats">(),
    [customCollection]: $.collection<CustomCollection>(),
    json: $.collection<WithJSON>(),
    addresses: $.collection<Address>(),
    mixed: $.collection<Mixed>(),
    oauth: $.collection<[GitHubAccount, MicrosoftAccount, GoogleAccount]>(),
    varUsers: $.collection<VarUser>(),
    comments: $.collection<Comment>(),
  }),
  { server: { preferRest: true } },
);

//#region schema
async function schema_() {
  // Creating custom collection
  {
    // Via constant named property

    const doc = await db[customCollection].get(await db[customCollection].id());
    db[customCollection].get;
    db.customCollectionName.get;
    doc?.data.hello;

    // Via name variable

    async function createDb(collection: string) {
      const customDB = schema(($) => ({
        users: $.collection<User>(),
        customCollection: $.collection<CustomCollection>().name(collection),
      }));

      const doc = await customDB.customCollection.get(
        await customDB.customCollection.id(),
      );

      doc?.data.hello;
    }
  }
}
//#endregion

//#region collection
async function collection() {
  //! Shared collection
  {
    interface ModelWithName {
      name: string;
    }

    function getAll(collection: Typesaurus.SharedCollection<ModelWithName>) {
      return collection.all();
    }

    const collectionResponses = await Promise.all([
      getAll(db.users.as<ModelWithName>()),
      getAll(db.accounts.as<ModelWithName>()),
      getAll(db.users(db.users.id("sasha")).books.as<ModelWithName>()),
      //! The collection must be compatible
      // @ts-expect-error
      getAll(db.appStats.as<ModelWithName>()),
    ]);
    collectionResponses.map((entities) =>
      entities.map((thing) => thing.data.name),
    );
  }

  //! Count
  {
    const docsCount = await db.users.count();
    docsCount.toFixed();

    const nestedDB = schema(($) => ({
      users: $.collection<User>().sub({
        settings: $.collection<{}>(),
      }),
    }));
    const nestedDocsCount = await nestedDB
      .users(nestedDB.users.id("whatever"))
      .settings.count();
    nestedDocsCount.toFixed();
  }
}
//#endregion

//#region Ref
async function ref() {
  /// Reading generic refs

  //// Model as generic
  {
    function get<Model extends { name: string }>(ref: Typesaurus.Ref<Model>) {
      return ref.get();
    }

    const userId = db.users.id("sasha");

    const user = await get(db.users.ref(userId));
    if (user) {
      user.data.name;
      user.data.birthdate;
    }

    const account = await get(db.accounts.ref(db.accounts.id("hello")));
    if (account) {
      account.data.name;
      account.data.contacts;
    }

    const book = await get(
      db.users(userId).books.ref(db.users.sub.books.id("world")),
    );
    if (book) {
      book.data.name;
      book.data.author;
    }
  }

  //// Ref as generic
  {
    function get<Ref extends Typesaurus.Ref<{ name: string }>>(ref: Ref) {
      return ref.get();
    }

    const userId = db.users.id("sasha");

    // @ts-expect-error: TODO: Make it work somehow?!
    const user = await get(db.users.ref(userId));
    if (user) {
      user.data.name;
      // @ts-expect-error: TODO: Make it work somehow?!
      user.data.birthdate;
    }

    // @ts-expect-error: TODO: Make it work somehow?!
    const account = await get(db.accounts.ref(db.accounts.id("hello")));
    if (account) {
      account.data.name;
      // @ts-expect-error: TODO: Make it work somehow?!
      account.data.contacts;
    }

    const book = await get(
      // @ts-expect-error: TODO: Make it work somehow?!
      db.users(userId).books.ref(db.users.sub.books.id("world")),
    );
    if (book) {
      book.data.name;
      // @ts-expect-error: TODO: Make it work somehow?!
      book.data.author;
    }
  }

  //// Ref union
  {
    type Schema = Core.InferSchema<typeof db>;

    function get(
      ref:
        | Schema["users"]["Ref"]
        | Schema["accounts"]["Ref"]
        | Schema["users"]["sub"]["books"]["Ref"],
    ) {
      return ref.get();
    }

    const userId = db.users.id("sasha");

    const user = await get(db.users.ref(userId));
    if (user) {
      user.data.name;
      // @ts-expect-error: We don't know if it's a user
      user.data.birthdate;
    }

    const account = await get(db.accounts.ref(db.accounts.id("hello")));
    if (account) {
      account.data.name;
      // @ts-expect-error: We don't know if it's an account
      account.data.contacts;
    }

    const book = await get(
      db.users(userId).books.ref(db.users.sub.books.id("world")),
    );
    if (book) {
      book.data.name;
      // @ts-expect-error: We don't know if it's a book
      book.data.author;
    }
  }

  /// Writing generic refs

  {
    type Schema = Core.InferSchema<typeof db>;

    function writeName(
      ref:
        | Schema["users"]["Ref"]
        | Schema["accounts"]["Ref"]
        | Schema["users"]["sub"]["books"]["Ref"],
      name: string,
    ) {
      // @ts-expect-error: TODO: Make it work somehow?!
      return ref.update({ name });
    }

    const userId = db.users.id("sasha");

    writeName(db.users.ref(userId), "Sasha");
    writeName(db.accounts.ref(db.accounts.id("hello")), "Hello");
    writeName(
      db.users(userId).books.ref(db.users.sub.books.id("world")),
      "World",
    );
  }
}
//#endregion

//#region Doc
async function doc() {
  const user = db.users.doc(db.users.id("sasha"), {
    name: "Sasha",
    contacts: {
      email: "koss@nocorp.me",
    },
    createdAt: new Date() as Typesaurus.ServerDate,
    status: undefined,
  });

  // Runtime environment

  if (user.test({ environment: "server" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Source

  if (user.test({ source: "database" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Server date strategy

  if (user.test({ dateStrategy: "estimate" })) {
    user.data.createdAt.getDay();
  } else if (user.test({ dateStrategy: "previous" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  assertType<TypeEqual<typeof user.data.birthdate, Date | undefined>>(true);

  // Variable shape

  const contentId = await db.content.id();

  const contentDoc = db.content.doc(contentId, {
    type: "image",
    src: "https://example.com/image.png",
    active: true,
  });

  db.content.doc(contentId, {
    type: "image",
    src: "https://example.com/image.png",
    // @ts-expect-error
    hello: "world",
  });

  // @ts-expect-error
  db.content.doc(contentId, {
    type: "image",
    src: "https://example.com/image.png",
    text: "Nope",
  });

  if (contentDoc.data.type === "image") {
    contentDoc.data.src;

    if (typeof contentDoc.data.text === "string")
      // @ts-expect-error - text is never
      contentDoc.data.text.length;
  } else {
    contentDoc.data.text;

    if (typeof contentDoc.data.src === "string")
      // @ts-expect-error - src is never
      contentDoc.data.src.length;
  }

  // Doc as server

  const serverUser = db.users.doc(
    db.users.id("sasha"),
    {
      name: "Sasha",
      contacts: {
        email: "koss@nocorp.me",
      },
      createdAt: new Date(),
      status: undefined,
    },
    { as: "server" },
  );

  serverUser.data.createdAt.getDay();

  // Fixed string ids

  db.appStats.doc("appStats", { users: 123 });

  // Opaque types in data

  const json = await db.json.get(db.json.id("index"));
  if (json) {
    assertType<TypeEqual<typeof json.data.str, OpaqueJSON>>(true);
    assertType<TypeEqual<typeof json.data.version, OpaqueNumber>>(true);
  }

  // Creating variable model fetched from DB

  const content = await db.content.get(contentId);
  if (content) db.content.doc(contentId, content.data);

  // Nullifies undefineds

  assertType<
    TypeEqual<typeof serverUser.data.alias, string | undefined | null>
  >(true);
}
//#endregion

//#region get
async function get() {
  const user = await db.users.get(db.users.id("sasha"));
  if (!user) return;

  // Runtime environment

  if (user.test({ environment: "server" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Source

  if (user.test({ source: "database" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Server date strategy

  if (user.test({ dateStrategy: "estimate" })) {
    user.data.createdAt.getDay();
  } else if (user.test({ dateStrategy: "previous" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Reading as server

  db.users.get(db.users.id("sasha")).then((user) => {
    if (!user) return;
    assertType<TypeEqual<Date | null, typeof user.data.createdAt>>(true);
  });

  db.users.get(db.users.id("sasha"), { as: "server" }).then((user) => {
    if (!user) return;
    assertType<TypeEqual<Date, typeof user.data.createdAt>>(true);
  });

  // ...via doc

  user.get().then((user) => {
    if (!user) return;
    assertType<TypeEqual<Date | null, typeof user.data.createdAt>>(true);
  });

  user.get({ as: "server" }).then((user) => {
    if (!user) return;
    assertType<TypeEqual<Date, typeof user.data.createdAt>>(true);
  });

  // Variable shape

  const content = await db.content.get(db.content.id("42"));
  if (!content) return;

  // Can't update variable model shape without narrowing

  content?.update({
    public: true,
  });

  // @ts-expect-error - can't update non-shared variable model fields
  content?.update({
    type: "text",
  });

  // Narrowing

  const textContent = content?.narrow<TextContent>(
    (data) => data.type === "text" && data,
  );

  if (textContent) {
    // @ts-expect-error - can't update - we narrowed down to text type
    await textContent.update({ src: "Nope" });

    await textContent.update({ text: "Yup" });
  }

  // Nullifies undefineds

  assertType<TypeEqual<typeof user.data.alias, string | undefined | null>>(
    true,
  );
}
//#endregion

//#region many
async function many() {
  const [user] = await db.users.many([db.users.id("sasha")]);
  if (!user) return;

  // Runtime environment

  if (user.test({ environment: "server" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Source

  if (user.test({ source: "database" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Server date strategy

  if (user.test({ dateStrategy: "estimate" })) {
    user.data.createdAt.getDay();
  } else if (user.test({ dateStrategy: "previous" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Reading as server

  db.users.many([db.users.id("sasha")]).then((users) => {
    const user = users[0];
    if (!user) return;
    assertType<TypeEqual<Date | null, typeof user.data.createdAt>>(true);
  });

  db.users.many([db.users.id("sasha")], { as: "server" }).then((users) => {
    const user = users[0];
    if (!user) return;
    assertType<TypeEqual<Date, typeof user.data.createdAt>>(true);
  });

  // Variable shape

  const [content] = await db.content.many([db.content.id("42")]);
  if (!content) return;

  // Can't update variable model shape without narrowing

  content?.update({
    public: true,
  });

  // @ts-expect-error - can't update non-shared variable model fields
  content?.update({
    type: "text",
  });

  // Narrowing

  const textContent = content?.narrow<TextContent>(
    (data) => data.type === "text" && data,
  );

  if (textContent) {
    // @ts-expect-error - can't update - we narrowed down to text type
    await textContent.update({ src: "Nope" });

    await textContent.update({ text: "Yup" });
  }

  // Nullifies undefineds

  assertType<TypeEqual<typeof user.data.alias, string | undefined | null>>(
    true,
  );
}
//#endregion

//#region all
async function all() {
  const [user] = await db.users.all();
  if (!user) return;

  // Runtime environment

  if (user.test({ environment: "server" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Source

  if (user.test({ source: "database" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Server date strategy

  if (user.test({ dateStrategy: "estimate" })) {
    user.data.createdAt.getDay();
  } else if (user.test({ dateStrategy: "previous" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Reading as server

  db.users.all().then((users) => {
    const user = users[0];
    if (!user) return;
    assertType<TypeEqual<Date | null, typeof user.data.createdAt>>(true);
  });

  db.users.all({ as: "server" }).then((users) => {
    const user = users[0];
    if (!user) return;
    assertType<TypeEqual<Date, typeof user.data.createdAt>>(true);
  });

  // Simple query

  await db.users.all();

  // Variable shape

  const [content] = await db.content.all();
  if (!content) return;

  // Can't update variable model shape without narrowing

  content?.update({
    public: true,
  });

  // @ts-expect-error - can't update non-shared variable model fields
  content?.update({
    type: "text",
  });

  // Narrowing

  const textContent = content?.narrow<TextContent>(
    (data) => data.type === "text" && data,
  );

  if (textContent) {
    // @ts-expect-error - can't update - we narrowed down to text type
    await textContent.update({ src: "Nope" });

    await textContent.update({ text: "Yup" });
  }

  // Nullifies undefineds

  assertType<TypeEqual<typeof user.data.alias, string | undefined | null>>(
    true,
  );
}
//#endregion

//#region query
async function query() {
  const [user] = await db.users.query(($) => $.field("name").eq("Sasha"));
  if (!user) return;

  // Runtime environment

  if (user.test({ environment: "server" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Source

  if (user.test({ source: "database" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Server date strategy

  if (user.test({ dateStrategy: "estimate" })) {
    user.data.createdAt.getDay();
  } else if (user.test({ dateStrategy: "previous" })) {
    user.data.createdAt.getDay();
  } else {
    // @tysts-start: strict - with strictNullChecks disabled there's no error
    // @ts-expect-error
    user.data.createdAt.getDay();
    // @tysts-end: strict
  }

  // Querying as server

  db.users
    .query(($) => $.field("name").eq("Sasha"))
    .then((users) => {
      const user = users[0];
      if (!user) return;
      assertType<TypeEqual<Date | null, typeof user.data.createdAt>>(true);
    });

  db.users
    .query(($) => $.field("name").eq("Sasha"), { as: "server" })
    .then((users) => {
      const user = users[0];
      if (!user) return;
      assertType<TypeEqual<Date, typeof user.data.createdAt>>(true);
    });

  // Basic query

  await db.users.query(($) => [
    $.field("name").eq("Sasha"),
    // @ts-expect-error
    $.field("contacts", "emal").equal("koss@nocorp.me"),
    $.field("name").order(),
    $.limit(1),
  ]);

  // Server date

  await db.accounts.query(($) => $.field("createdAt").eq(new Date()));

  await db.accounts.query(($) =>
    $.field("createdAt").order("asc", $.startAt(new Date())),
  );

  // Cursors

  await db.users.query(($) => $.field("name").order($.startAt("Sasha")));

  await db.users.query(($) => $.field("name").order($.endAt("Sasha")));

  await db.users.query(($) =>
    $.field("name").order([$.startAt("Sasha"), $.endAt("Tati")]),
  );

  await db.users.query(($) =>
    // @ts-expect-error - can't use start cursor after end cursor
    $.field("name").order([$.endAt("Tati"), $.startAt("Sasha")]),
  );

  const nameCursor: string | undefined = "hello";
  const useCursor = false;

  await db.users.query(($) =>
    $.field("name").order(nameCursor && $.startAt(nameCursor)),
  );

  await db.users.query(($) =>
    $.field("name").order(useCursor && $.startAt("Sasha")),
  );

  await db.users.query(($) =>
    $.field("name").order(useCursor ? $.startAt("Sasha") : undefined),
  );

  await db.users.query(($) =>
    $.field("name").order(nameCursor ? [$.startAfter(nameCursor)] : []),
  );

  // Falsy cursors

  await db.users.query(($) =>
    $.field("name").order(nameCursor && $.startAfter(nameCursor)),
  );

  await db.users.query(($) => [
    $.field("name").order(undefined),
    $.field("name").order(null),
    $.field("name").order(false),
    $.field("name").order(""),
    $.field("name").order(0),
  ]);

  await db.users.query(($) => [
    $.field("name").order([undefined]),
    $.field("name").order([null]),
    $.field("name").order([false]),
    $.field("name").order([""]),
    $.field("name").order([0]),
  ]);

  await db.users.query(($) => [
    $.field("name").order([undefined, $.endAt("Sasha")]),
    $.field("name").order([null, $.endAt("Sasha")]),
    $.field("name").order([false, $.endAt("Sasha")]),
    $.field("name").order(["", $.endAt("Sasha")]),
    $.field("name").order([0, $.endAt("Sasha")]),
  ]);

  await db.users.query(($) => [
    $.field("name").order([$.startAt("Sasha"), undefined]),
    $.field("name").order([$.startAt("Sasha"), null]),
    $.field("name").order([$.startAt("Sasha"), false]),
    $.field("name").order([$.startAt("Sasha"), ""]),
    $.field("name").order([$.startAt("Sasha"), 0]),
  ]);

  await db.users.query(($) => [
    $.field("name").order([undefined, undefined]),
    $.field("name").order([null, null]),
    $.field("name").order([false, false]),
    $.field("name").order(["", ""]),
    $.field("name").order([0, 0]),
  ]);

  // Subscription

  const offQuery = db.users
    .query(($) => [
      $.field("name").eq("Sasha"),
      $.field("contacts", "email").eq("koss@nocorp.me"),
      $.field("name").order(),
      $.limit(1),
    ])
    .on((users) => {})
    .catch((error) => {});

  offQuery();

  // Nested fields

  await db.users.query(($) => [
    $.field("contacts", "email").eq("koss@nocorp.me"),
  ]);

  // Optional path
  await db.accounts.query(($) => [
    $.field("nested1Optional", "nested12Optional", "hello").eq("World!"),
  ]);

  // where

  // in

  await db.accounts.query(($) => [
    $.field($.docId()).in([db.accounts.id("id1"), db.accounts.id("id2")]),
  ]);

  await db.accounts.query(($) => [
    // @ts-expect-error - the value should be an array
    $.where($.docId(), "in", "id1"),
  ]);

  // array-contains

  await db.posts.query(($) => $.field("likeIds").contains("id1"));

  // @ts-expect-error - the value should be a string
  await db.posts.query(($) => $.field("likeIds").contains(1));

  // order

  await db.accounts.query(($) => $.field($.docId()).order());

  await db.accounts.query(($) => $.field("contacts").order());

  await db.accounts.query(($) => $.field("contacts", "email").order());

  await db.accounts.query(($) => $.field("contacts", "phone").order());

  // @ts-expect-error - nope is not a valid field
  await db.accounts.query(($) => $.field("contacts", "nope").order());

  // Variable shape

  const [content] = await db.content.query(($) => []);
  if (!content) return;

  // Can't update variable model shape without narrowing

  content?.update({
    public: true,
  });

  // @ts-expect-error - can't update non-shared variable model fields
  content?.update({
    type: "text",
  });

  // Narrowing

  const textContent = content?.narrow<TextContent>(
    (data) => data.type === "text" && data,
  );

  if (textContent) {
    // @ts-expect-error - can't update - we narrowed down to text type
    await textContent.update({ src: "Nope" });

    await textContent.update({ text: "Yup" });
  }

  // Empty query

  // @tysts-start: strict - with strictNullChecks disabled there's no error
  const emptyQuery = db.accounts.query(($) => undefined);
  assertType<TypeEqual<typeof emptyQuery, undefined>>(true);
  // @tysts-end: strict

  // Empty query fields

  db.users.query(($) => [
    $.field("name").eq("Sasha"),
    undefined,
    null,
    false,
    "",
    0,
  ]);

  // Union fields query

  // Simple
  db.users.query(($) => $.field("contacts", "city").eq("Singapore"));
  // @ts-expect-error - address is a string
  db.users.query(($) => $.field("contacts", "city").eq(123));
  // @ts-expect-error - the string keys should not leak
  db.users.query(($) => $.field("contacts", "charAt").equal("Singapore"));

  // Deeply nested
  db.users.query(($) => $.field("contacts", "address", "zip").eq("123456"));
  // @ts-expect-error - nope is not a correct field
  db.users.query(($) => $.field("contacts", "address", "nope").equal("nah"));

  // Not
  db.users.query(($) => $.field("contacts", "city").not("Singapore"));
  // @ts-expect-error - city is a string
  db.users.query(($) => $.field("contacts", "city").not(true));

  // Greater than
  db.users.query(($) => $.field("contacts", "city").gt("Singapore"));
  // @ts-expect-error - city is a string
  db.users.query(($) => $.field("contacts", "city").gt(123));

  // Greater than or equal
  db.users.query(($) => $.field("contacts", "city").gte("Singapore"));
  // @ts-expect-error - city is a string
  db.users.query(($) => $.field("contacts", "city").gte(123));

  // Less than
  db.users.query(($) => $.field("contacts", "city").lt("Singapore"));
  // @ts-expect-error - city is a string
  db.users.query(($) => $.field("contacts", "city").lt(123));

  // Less than or equal
  db.users.query(($) => $.field("contacts", "city").lte("Singapore"));
  // @ts-expect-error - city is a string
  db.users.query(($) => $.field("contacts", "city").lte(123));

  // Array contains
  db.users.query(($) => $.field("contacts", "zip").contains("098765"));
  // @ts-expect-error - zip is an array of numbers
  db.users.query(($) => $.field("contacts", "zip").contains(98765));

  // Array contains any
  db.users.query(($) => $.field("contacts", "zip").containsAny(["098765"]));
  // @ts-expect-error - zip is an array of numbers
  db.users.query(($) => $.field("contacts", "zip").containsAny([98765]));

  // In
  db.users.query(($) => $.field("contacts", "city").in(["Singapore"]));
  // @ts-expect-error - city is a string
  db.users.query(($) => $.field("contacts", "city").in([123]));

  // Not in
  db.users.query(($) => $.field("contacts", "city").notIn(["Singapore"]));
  // @ts-expect-error - city is a string
  db.users.query(($) => $.field("contacts", "city").notIn([123]));

  // Cursors
  db.users.query(($) =>
    $.field("contacts", "city").order("asc", [
      $.startAfter("Singapore"),
      $.endAt("Bangkok"),
    ]),
  );
  db.users.query(($) =>
    $.field("contacts", "city").order("asc", [
      // @ts-expect-error - city is a string
      $.startAfter(123),
      // @ts-expect-error - city is a string
      $.endAt(456),
    ]),
  );
  db.users.query(($) =>
    $.field("contacts", "city").order("asc", [
      $.startAt("Singapore"),
      $.endBefore("Bangkok"),
    ]),
  );
  db.users.query(($) =>
    $.field("contacts", "city").order("asc", [
      // @ts-expect-error - city is a string
      $.startAt(123),
      // @ts-expect-error - city is a string
      $.endBefore(456),
    ]),
  );

  // Variable shape
  db.content.query(($) => $.field("src").eq("https://exama.com/image.png"));

  // Count

  const sashasCount = await db.users
    .query(($) => $.field("name").eq("Sasha"))
    .count();

  sashasCount.toFixed();

  // Nullifies undefineds

  assertType<TypeEqual<typeof user.data.alias, string | undefined | null>>(
    true,
  );

  // Allows to query by null

  db.comments.query(($) => $.field("author").eq(null));

  // Allows to use or query

  db.comments.query(($) => [
    $.field("text").eq("Hello"),
    $.or($.field("author").eq("Sasha"), $.field("author").eq("Tati")),
  ]);

  const $or = db.comments.query.build();

  $or.field("text").eq("Hello");
  $or.or($or.field("author").eq("Sasha"), $or.field("author").eq("Tati"));

  // It prevents using non-where queries in where

  // @ts-expect-error - Can't use order in where
  db.comments.query(($) => [$.field("text").eq("Hello"), $.or($.limit(1))]);

  // It allows to query via opaqued types

  db.mixed.query(($) => $.field("record", "123" as OpaqueString).eq("123"));
  db.mixed.query(($) =>
    $.field("nestedRecord", "record", "123" as OpaqueString).eq("123"),
  );
  db.mixed.query(($) =>
    $.field("idRecord", "123" as Typesaurus.Id<"hello">).eq(123),
  );
  db.mixed.query(($) =>
    $.field("nestedIdRecord", "idRecord", "123" as Typesaurus.Id<"hello">).eq(
      123,
    ),
  );
}
//#endregion

//#region
async function add() {
  // Simple add

  await db.posts.add({
    title: "Hello, world!",
    text: "Hello!",
    active: true,
  });

  // Upset with helpers

  await db.users.add(($) => ({
    name: "Sasha",
    contacts: { email: "koss@nocorp.me" },
    createdAt: $.serverDate(),
    status: undefined,
  }));

  await db.users.add(
    {
      name: "Sasha",
      contacts: { email: "koss@nocorp.me" },
      createdAt: new Date(),
      status: undefined,
    },
    { as: "server" },
  );

  // Adding to variable collection

  await db.content.add({
    type: "text",
    text: "Hello, world!",
    active: true,
  });

  await db.content.add({
    type: "image",
    src: "https://example.com/image.png",
    active: true,
  });

  await db.content.add({
    type: "image",
    src: "https://example.com/image.png",
    // @ts-expect-error - text is not valid for image
    text: "Nope",
  });

  // Adding variable model fetched from DB

  const content = await db.content.get(db.content.id("content-id"));
  if (content) db.content.add(content.data);

  // Allows to set nulls instead of undefineds

  await db.users.add(($) => ({
    name: "Sasha",
    contacts: { email: "koss@nocorp.me" },
    createdAt: $.serverDate(),
    status: null,
  }));
}
//#endregion

//#region set
async function set() {
  // Simple set

  db.posts.set(db.posts.id("doc-id"), {
    title: "Hello, world!",
    text: "Hello!",
    active: true,
  });

  // Set with helpers

  await db.users.set(db.users.id("sasha"), ($) => ({
    name: "Sasha",
    contacts: { email: "koss@nocorp.me" },
    createdAt: $.serverDate(),
    status: undefined,
  }));

  await db.users.set(
    db.users.id("sasha"),
    {
      name: "Sasha",
      contacts: { email: "koss@nocorp.me" },
      createdAt: new Date(),
      status: undefined,
    },
    { as: "server" },
  );

  // Setting to variable collection

  const contentId = db.content.id("content-id");

  await db.content.set(contentId, {
    type: "text",
    text: "Hello, world!",
    active: true,
  });

  await db.content.set(contentId, {
    type: "image",
    src: "https://example.com/image.png",
    active: true,
  });

  await db.content.set(contentId, {
    type: "image",
    src: "https://example.com/image.png",
    // @ts-expect-error - text is not valid for image
    text: "Nope",
  });

  // ...via ref

  const contentRef = db.content.ref(contentId);

  await contentRef.set({
    type: "text",
    text: "Hello, world!",
    active: true,
  });

  await contentRef.set({
    type: "image",
    src: "https://example.com/image.png",
    active: true,
  });

  await contentRef.set({
    type: "image",
    src: "https://example.com/image.png",
    // @ts-expect-error - text is not valid for image
    text: "Nope",
  });

  // ...via doc

  const contentDoc = await db.content.get(contentId);

  await contentDoc?.set({
    type: "text",
    text: "Hello, world!",
    active: true,
  });

  await contentDoc?.set({
    type: "image",
    src: "https://example.com/image.png",
    active: true,
  });

  await contentDoc?.set({
    type: "image",
    src: "https://example.com/image.png",
    // @ts-expect-error - text is not valid for image
    text: "Nope",
  });

  // Setting variable model fetched from DB

  const content = await db.content.get(contentId);
  if (content) {
    content.set(content.data);
    content.ref.set(content.data);
    db.content.set(contentId, content.data);
  }

  // Allows to set nulls instead of undefineds

  await db.users.set(db.users.id("123"), ($) => ({
    name: "Sasha",
    contacts: { email: "koss@nocorp.me" },
    createdAt: $.serverDate(),
    status: null,
  }));
}
//#endregion

//#region upset
async function upset() {
  // Simple set

  db.posts.upset(db.posts.id("doc-id"), {
    title: "Hello, world!",
    text: "Hello!",
    active: true,
  });

  // Upset with helpers

  await db.users.upset(db.users.id("sasha"), ($) => ({
    name: "Sasha",
    contacts: { email: "koss@nocorp.me" },
    createdAt: $.serverDate(),
    status: undefined,
  }));

  await db.users.upset(
    db.users.id("sasha"),
    {
      name: "Sasha",
      contacts: { email: "koss@nocorp.me" },
      createdAt: new Date(),
      status: undefined,
    },
    { as: "server" },
  );

  // Upsetting to variable collection

  const contentId = db.content.id("content-id");

  await db.content.upset(contentId, {
    type: "text",
    text: "Hello, world!",
    active: true,
  });

  await db.content.upset(contentId, {
    type: "image",
    src: "https://example.com/image.png",
    active: true,
  });

  await db.content.upset(contentId, {
    type: "image",
    src: "https://example.com/image.png",
    // @ts-expect-error - text is not valid for image
    text: "Nope",
  });

  // ...via ref

  const contentRef = db.content.ref(contentId);

  await contentRef.upset({
    type: "text",
    text: "Hello, world!",
    active: true,
  });

  await contentRef.upset({
    type: "image",
    src: "https://example.com/image.png",
    active: true,
  });

  await contentRef.upset({
    type: "image",
    src: "https://example.com/image.png",
    // @ts-expect-error - text is not valid for image
    text: "Nope",
  });

  // ...via doc

  const contentDoc = await db.content.get(contentId);

  await contentDoc?.upset({
    type: "text",
    text: "Hello, world!",
    active: true,
  });

  await contentDoc?.upset({
    type: "image",
    src: "https://example.com/image.png",
    active: true,
  });

  await contentDoc?.upset({
    type: "image",
    src: "https://example.com/image.png",
    // @ts-expect-error - text is not valid for image
    text: "Nope",
  });

  // Upsetting variable model fetched from DB

  const content = await db.content.get(contentId);
  if (content) {
    content.upset(content.data);
    content.ref.upset(content.data);
    db.content.upset(contentId, content.data);
  }

  // Setting undefined to optional fields

  const baseWithoutStatus = {
    name: "Sasha",
    contacts: { email: "koss@nocorp.me" },
    createdAt: new Date(),
  };

  const base = {
    ...baseWithoutStatus,
    status: undefined,
  };

  // If it's only optional field, you should not be able to set it to undefined
  // as long as exactOptionalPropertyTypes is set
  await db.users.upset(
    db.users.id("sasha"),
    // @tysts-start: strict
    // @ts-expect-error - birthdate is optional not undefined
    // @tysts-end: strict
    {
      ...base,
      birthdate: undefined,
    },
    { as: "server" },
  );
  // But you can skip it
  await db.users.upset(db.users.id("sasha"), base, { as: "server" });

  // If it's optional and undefined, it can be both set to undefined and skipped
  await db.users.upset(
    db.users.id("sasha"),
    {
      ...base,
      alias: undefined,
    },
    { as: "server" },
  );
  await db.users.upset(db.users.id("sasha"), base, { as: "server" });

  // If it's undefined it can be set to undefined but can't be skipped
  await db.users.upset(
    db.users.id("sasha"),
    {
      ...base,
      status: undefined,
    },
    { as: "server" },
  );
  // @ts-expect-error - status is required
  await db.users.upset(db.users.id("sasha"), baseWithoutStatus, {
    as: "server",
  });

  // It should accept the original model

  const mixed = await db.mixed.get(db.mixed.id("sasha"), {
    as: "server",
  });
  mixed &&
    (await db.mixed.upset(db.mixed.id("sasha"), mixed.data, {
      as: "server",
    }));

  // Allows to set nulls instead of undefineds

  await db.users.upset(db.users.id("123"), ($) => ({
    name: "Sasha",
    contacts: { email: "koss@nocorp.me" },
    createdAt: $.serverDate(),
    status: null,
  }));
}
//#endregion

//#region update
async function update() {
  // Simple update

  await db.users.update(db.users.id("sasha"), {
    name: "Alexander",
  });

  await db.users.update(db.users.id("sasha"), {
    // @ts-expect-error: nope is not a valid field
    nope: true,
  });

  // @ts-expect-error: nope is not a valid field
  await db.users.update(db.users.id("sasha"), {
    name: "Alexander",
    nope: true,
  });

  db.users.get(db.users.id("sasha")).then(async (doc) => {
    if (!doc) return;

    // ...via doc:

    await doc.update({
      name: "Alexander",
    });

    await doc.update({
      // @ts-expect-error: nope is not a valid field
      nope: true,
    });

    // @ts-expect-error: nope is not a valid field
    await doc.update({
      name: "Alexander",
      nope: true,
    });

    // ...via ref:

    await doc.ref.update({
      name: "Alexander",
    });

    await doc.ref.update({
      // @ts-expect-error: nope is not a valid field
      nope: true,
    });

    // @ts-expect-error: nope is not a valid field
    await doc.ref.update({
      name: "Alexander",
      nope: true,
    });
  });

  // Update with helpers

  await db.users.update(db.users.id("sasha"), ($) => ({
    name: "Sasha",
    birthdate: $.remove(),
    createdAt: $.serverDate(),
  }));

  await db.posts.update(db.posts.id("post-id"), ($) => ({
    likes: $.increment(5),
    likeIds: $.arrayUnion("like-id"),
  }));

  await db.posts.update(db.posts.id("post-id"), ($) => ({
    likeIds: $.arrayRemove("like-id"),
  }));

  // @ts-expect-error: nope is not a valid field
  await db.users.update(db.users.id("sasha"), ($) => ({
    nope: true,
  }));

  // TODO: ts-expect-error: nope is not a valid field
  // If one of these issues ever get fixed, restore the ts-expect-error:
  // - https://github.com/microsoft/TypeScript/issues/241
  // - https://github.com/microsoft/TypeScript/issues/12936
  await db.users.update(db.users.id("sasha"), ($) => ({
    name: "Sasha",
    nope: true,
  }));

  db.users.get(db.users.id("sasha")).then(async (doc) => {
    if (!doc) return;

    // ...via doc:

    await doc.update(($) => ({
      name: "Alexander",
    }));

    // @ts-expect-error: nope is not a valid field
    await doc.update(($) => ({
      nope: true,
    }));

    // TODO: ts-expect-error: nope is not a valid field
    // If one of these issues ever get fixed, restore the ts-expect-error:
    // - https://github.com/microsoft/TypeScript/issues/241
    // - https://github.com/microsoft/TypeScript/issues/12936
    await doc.update(($) => ({
      name: "Alexander",
      nope: true,
    }));

    // ...via ref:

    await doc.ref.update(($) => ({
      name: "Alexander",
    }));

    // @ts-expect-error: nope is not a valid field
    await doc.ref.update(($) => ({
      nope: true,
    }));

    // TODO: ts-expect-error: nope is not a valid field
    // If one of these issues ever get fixed, restore the ts-expect-error:
    // - https://github.com/microsoft/TypeScript/issues/241
    // - https://github.com/microsoft/TypeScript/issues/12936
    await doc.ref.update(($) => ({
      name: "Alexander",
      nope: true,
    }));
  });

  // Update as server

  await db.users.update(
    db.users.id("sasha"),
    { createdAt: new Date() },
    { as: "server" },
  );

  await db.users.update(
    db.users.id("sasha"),
    () => ({ createdAt: new Date() }),
    { as: "server" },
  );

  await db.users.update(
    db.users.id("sasha"),
    ($) => $.field("createdAt").set(new Date()),
    { as: "server" },
  );

  const updateAsBuild = db.users.update.build(db.users.id("sasha"), {
    as: "server",
  });

  updateAsBuild.field("createdAt").set(new Date());

  // Enforce required fields

  // @ts-expect-error - name is required
  await db.users.update(db.users.id("sasha"), ($) => ({
    name: $.remove(),
  }));

  // @tysts-start: strict - without exactOptionalPropertyTypes we can't prevent undefined from being set
  // @ts-expect-error - name is required
  await db.users.update(db.users.id("sasha"), ($) => ({
    name: undefined,
  }));

  // @ts-expect-error - name is required
  await db.users.update(db.users.id("sasha"), {
    name: undefined,
  });
  // @tysts-end: strict

  // @tysts-start: strict - with strictNullChecks disabled there's no error
  await db.users.update(db.users.id("sasha"), ($) =>
    // @ts-expect-error - name is required
    $.field("name").set(undefined),
  );
  // @tysts-end: strict

  // Setting undefined to optional fields

  // If it's only optional field, you should not be able to set it to undefined
  // as long as exactOptionalPropertyTypes is set
  // @tysts-start: strict
  // @ts-expect-error - birthdate is optional not undefined
  // @tysts-end: strict
  await db.users.update(db.users.id("sasha"), {
    birthdate: undefined,
  });
  await db.users.update(db.users.id("sasha"), ($) =>
    // @tysts-start: strict
    // @ts-expect-error - birthdate is optional not undefined
    // @tysts-end: strict
    $.field("birthdate").set(undefined),
  );
  await db.users.update(db.users.id("sasha"), ($) =>
    // @tysts-start: strict
    // @ts-expect-error - birthdate is optional not undefined
    // @tysts-end: strict
    $.field("birthdate").set(null),
  );
  // But it should be removable
  await db.users.update(db.users.id("sasha"), ($) => ({
    birthdate: $.remove(),
  }));

  // If it's optional and undefined, it can be both set to undefined and removed
  await db.users.update(db.users.id("sasha"), {
    alias: undefined,
  });
  await db.users.update(db.users.id("sasha"), ($) =>
    $.field("alias").set(undefined),
  );
  await db.users.update(db.users.id("sasha"), ($) =>
    $.field("alias").set(null),
  );
  await db.users.update(db.users.id("sasha"), ($) => ({
    alias: $.remove(),
  }));

  // If it's undefined but not optional, it can't be removed, but can be set to undefined or null
  await db.users.update(db.users.id("sasha"), {
    status: undefined,
  });
  await db.users.update(db.users.id("sasha"), {
    status: null,
  });
  await db.users.update(db.users.id("sasha"), ($) =>
    $.field("status").set(undefined),
  );
  await db.users.update(db.users.id("sasha"), ($) =>
    $.field("status").set(null),
  );
  // @ts-expect-error - status is required
  await db.users.update(db.users.id("sasha"), ($) => ({
    status: $.remove(),
  }));

  // It should accept the original data

  const mixed = await db.mixed.get(db.mixed.id("sasha"), {
    as: "server",
  });
  mixed &&
    (await db.mixed.update(db.mixed.id("sasha"), mixed.data, {
      as: "server",
    }));
  // Works with nested fields

  await db.users.update(db.users.id("sasha"), ($) => ({
    contacts: {
      email: "koss@nocorp.me",
      phone: $.remove(),
    },
  }));

  // @ts-expect-error - email is required
  await db.users.update(db.users.id("sasha"), ($) => ({
    contacts: {
      email: $.remove(),
    },
  }));

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    $.field("nested1Optional").set($.remove()),
  );

  // Single field update

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    $.field("name").set("Alexander"),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    // @ts-expect-error: nope is not a valid field
    $.field("nope").set(true),
  );

  // Multiple fields update

  await db.accounts.update(db.accounts.id("sasha"), ($) => [
    $.field("name").set("Alexander"),
    $.field("createdAt").set($.serverDate()),
  ]);

  await db.accounts.update(db.accounts.id("sasha"), ($) => [
    $.field("name").set("Alexander"),
    // @ts-expect-error: nope is not a valid field
    $.field("nope").set(true),
  ]);

  // Nested fields

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    $.field("contacts", "phone").set("+65xxxxxxxx"),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    // @ts-expect-error - wrong type
    $.field("contacts", "phone").set(6500000000),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    // @ts-expect-error - can't update because emergencyContacts can be undefined
    $.field("emergencyContacts", "phone").set("+65xxxxxxxx"),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    // @ts-expect-error - emergencyContacts must have name and phone
    $.field("emergencyContacts").set({ name: "Sasha" }),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    $.field("emergencyContacts").set({
      name: "Sasha",
      phone: "+65xxxxxxxx",
    }),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    $.field("emergencyContacts").set({
      // @ts-expect-error: nope is not a valid field
      nope: true,
    }),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    $.field("emergencyContacts").set({
      name: "Sasha",
      // @ts-expect-error: nope is not a valid field
      nope: true,
    }),
  );

  // Deeply nested field corner cases

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    $.field("nested1Required", "nested12Required").set({
      hello: "Hello!",
    }),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    $.field("nested1Required", "nested12Required").set({
      hello: "Hello!",
      world: "World!",
    }),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    // @ts-expect-error - can't update without hello
    $.field("nested1Required", "nested12Required").set({
      world: "World!",
    }),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    // @ts-expect-error - should not update because requried12 on nested1Optional is required
    $.field("nested1Optional", "nested12Optional").set({ hello: "Hello!" }),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    // @ts-expect-error - nested1Optional has required12, so can't update
    $.field("nested1Optional", "nested12Optional").set({
      world: "World!",
    }),
  );

  // Nested fields with records

  const postId = "post-id";

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    $.field("counters").set({ [postId]: { likes: 5 } }),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    $.field("counters", postId).set({ likes: 5 }),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    $.field("counters", postId, "likes").set($.increment(1)),
  );

  await db.accounts.update(db.accounts.id("sasha"), ($) =>
    $.field("counters", postId, "likes").set($.remove()),
  );

  // Increment on nested optional values

  db.organizations.update(db.organizations.id("org-id"), ($) => ({
    counters: {
      drafts: $.increment(0),
      scheduled: $.increment(1),
      published: $.increment(0),
    },
  }));

  db.organizations.update(db.organizations.id("org-id"), ($) =>
    $.field("counters").set({
      drafts: $.increment(0),
      scheduled: $.increment(1),
      published: $.increment(0),
    }),
  );

  // Increment on opaque numbers

  const json = await db.json.get(db.json.id("index"));
  if (json) {
    // @ts-expect-error: Should allow only incrementing via the opaque number
    json.update(($) => $.field("version").set($.increment(1)));
    json.update(($) => $.field("version").set($.increment(1 as OpaqueNumber)));
  }

  // Updating variable collection

  const contentId = db.content.id("hello-world!");

  // Can't update variable model shape without narrowing

  db.content.update(contentId, {
    public: true,
  });

  db.content.update(contentId, ($) => $.field("public").set(true));

  // @ts-expect-error - can't update non-shared variable model fields
  db.content.update(contentId, {
    type: "text",
  });

  db.content.update(contentId, ($) =>
    // @ts-expect-error - can't update non-shared variable model fields
    $.field("type").set("text"),
  );

  db.varUsers.update(db.varUsers.id("id"), {
    anonymous: true,
  });

  db.varUsers.update(db.varUsers.id("id"), {
    anonymous: false,
    emailVerified: false,
    email: "hello@example.com",
  });

  // Build Mode

  const collectionUpdate = db.content.update.build(contentId);

  collectionUpdate.field("public").set(true);

  // @ts-expect-error - can't update non-shared variable model fields
  collectionUpdate.field("type").set("text");

  // @ts-expect-error - nope is not a valid field
  collectionUpdate.field("nope").set(true);

  // ...via doc

  const content = await db.content.get(contentId);

  content?.update({
    public: true,
  });

  content?.update(($) => $.field("public").set(true));

  // @ts-expect-error - can't update non-shared variable model fields
  content?.update({
    type: "text",
  });

  content?.update({
    // @ts-expect-error - nope is not a valid field
    nope: true,
  });

  content?.update(($) =>
    // @ts-expect-error - can't update non-shared variable model fields
    $.field("type").set("text"),
  );

  // Narrowing

  const textContent = content?.narrow<TextContent>(
    (data) => data.type === "text" && data,
  );

  if (textContent) {
    // @ts-expect-error - can't update - we narrowed down to text type
    await textContent.update({ src: "Nope" });

    await textContent.update(($) =>
      // @ts-expect-error - can't update - we narrowed down to text type
      $.field("src").set("Nope"),
    );

    await textContent.update({ text: "Yup" });

    await textContent.update(($) => $.field("text").set("Yup"));

    const textContentUpdate = textContent.update.build();

    // @ts-expect-error - can't update - we narrowed down to text type
    textContentUpdate.field("src").set("Nope");

    textContentUpdate.field("text").set("Ok");

    // ...via ref:

    // @ts-expect-error - can't update - we narrowed down to text type
    await textContent.ref.update({ src: "Nope" });

    await textContent.ref.update(($) =>
      // @ts-expect-error - can't update - we narrowed down to text type
      $.field("src").set("Nope"),
    );

    await textContent.ref.update({ text: "Yup" });

    await textContent.ref.update(($) => $.field("text").set("Yup"));

    const textContentRefUpdate = textContent.ref.update.build();

    // @ts-expect-error - can't update - we narrowed down to text type
    textContentRefUpdate.field("src").set("Nope");

    textContentRefUpdate.field("text").set("Ok");
  }

  const docUpdate = content?.update.build();

  docUpdate?.field("public").set(true);

  // @ts-expect-error - can't update non-shared variable model fields
  docUpdate?.field("type").set("text");

  // ...via ref

  const contentRef = await db.content.ref(contentId);

  contentRef?.update({
    public: true,
  });

  content?.update(($) => $.field("public").set(true));

  // @ts-expect-error - can't update non-shared variable model fields
  contentRef?.update({
    type: "text",
  });

  content?.update(($) =>
    // @ts-expect-error - can't update non-shared variable model fields
    $.field("type").set("text"),
  );

  const refUpdate = content?.update.build();

  refUpdate?.field("public").set(true);

  // @ts-expect-error - can't update non-shared variable model fields
  refUpdate?.field("type").set("text");

  const accountId = db.oauth.id("123");

  const account = await db.oauth.get(accountId);

  // @ts-expect-error - Can't update account
  account?.update({ userId: "123" });

  // @ts-expect-error - Can't update account
  account?.update(($) => $.field("userId").set("123"));

  const $account = account?.update.build();
  // @ts-expect-error - Can't update account
  $account?.field("userId").set("123");

  // Should be ok
  const ghAccount = account?.narrow<GitHubAccount>(
    (data) => data.type === "github" && data,
  );
  await ghAccount?.update({ userId: "123" });

  ghAccount?.update(($) => $.field("userId").set("123"));

  const $ghAccount = account?.update.build();
  // @ts-expect-error - Can't update account
  $ghAccount?.field("userId").set("123");

  // It allows update with assign data minus shared fields

  db.oauth.update(db.oauth.id("123"), {
    type: "github",
    userId: "123",
  });

  db.content.update(db.content.id("content-id"), {
    type: "text",
    text: "Hello world!",
  });

  // Empty update

  const userId = db.users.id("user-id");

  db.users.update(userId, () => undefined);
  db.users.update(userId, () => "");
  db.users.update(userId, () => null);
  const emptyUpdate1 = db.users.update(userId, () => undefined);

  // @tysts-start: strict - with strictNullChecks disabled there's no error
  assertType<TypeEqual<typeof emptyUpdate1, undefined>>(true);
  // @tysts-end: strict

  db.users.get(userId).then((user) => {
    if (!user) return;

    user.update(() => undefined);
    user.update(() => "");
    user.update(() => null);
    const emptyUpdate2 = user.update(() => undefined);

    // @tysts-start: strict - with strictNullChecks disabled there's no error
    assertType<TypeEqual<typeof emptyUpdate2, undefined>>(true);
    // @tysts-end: strict
  });

  // Empty update fields

  db.users.update(userId, ($) => [
    $.field("name").set("Sasha"),
    undefined,
    "",
    null,
  ]);

  // Updating variable model fetched from DB

  const content2 = await db.content.get(contentId);
  if (content2) {
    content2.update(content2.data);
    content2.ref.update(content2.data);
    db.content.update(contentId, content2.data);
  }

  // It disallows updating array fields via dot notation

  db.addresses.update(db.addresses.id("address-id"), ($) =>
    // @ts-expect-error - Can't update array fields via dot notation
    $.field("address", "lines", 0).set("123 Main St"),
  );

  const $dotNope = db.addresses.update.build(db.addresses.id("address-id"));
  // @ts-expect-error - Can't update array fields via dot notation
  $dotNope.field("address", "lines", 0).set("123 Main St");

  db.addresses.update(db.addresses.id("address-id"), ($) =>
    // @ts-expect-error - Can't update array fields via dot notation
    $.field("addresses", 0).set("Hello world"),
  );

  db.addresses.update(db.addresses.id("address-id"), ($) =>
    // @ts-expect-error - Can't remove array fields via dot notation
    $.field("addresses", 0).set($.remove()),
  );

  // Allows to set nulls instead of undefineds

  await db.users.update(db.users.id("123"), {
    status: null,
  });

  await db.users.update(db.users.id("123"), ($) => ({
    status: null,
  }));

  await db.users.update(db.users.id("123"), ($) => $.field("status").set(null));

  const $userNullify = db.users.update.build(db.users.id("123"));

  $userNullify.field("status").set(null);

  // Allows to update with null

  db.comments.update(db.comments.id("comment-id"), ($) =>
    $.field("author").set(null),
  );

  // Allows to update shared

  async function updateActive(
    entity:
      | Typesaurus.SharedDoc<SharedFields>
      | Typesaurus.SharedRef<SharedFields>,
  ) {
    if (entity.type === "doc") {
      // @ts-expect-error - Can't set shared doc
      entity.set;
      // @ts-expect-error - Can't upset shared doc
      entity.upset;
      // @ts-expect-error - Can't as shared doc
      entity.as;

      // @ts-expect-error - Can't set shared ref
      entity.ref.set;
      // @ts-expect-error - Can't upset shared ref
      entity.ref.upset;
      // @ts-expect-error - Can't as shared ref
      entity.ref.upset;

      // @ts-expect-error - Can't add to shared collection
      entity.ref.collection.set;
      // @ts-expect-error - Can't set shared collection ref
      entity.ref.collection.set;
      // @ts-expect-error - Can't upset shared collection ref
      entity.ref.collection.upset;
      // @ts-expect-error - Can't update shared collection ref
      entity.ref.collection.update;
      // @ts-expect-error - Can't as shared collection ref
      entity.ref.collection.as;

      // @ts-expect-error - nope is not a valid field
      await entity.ref.update({ active: true, nope: false });
      // @ts-expect-error - nope is not a valid field
      await entity.ref.update({ nope: false });
      await entity.ref.update({ active: true });
    } else {
      // ref

      // @ts-expect-error - Can't set shared ref
      entity.set;
      // @ts-expect-error - Can't upset shared ref
      entity.upset;
      // @ts-expect-error - Can't as shared ref
      entity.as;

      // @ts-expect-error - Can't add to shared collection
      entity.collection.set;
      // @ts-expect-error - Can't set shared collection ref
      entity.collection.set;
      // @ts-expect-error - Can't upset shared collection ref
      entity.collection.upset;
      // @ts-expect-error - Can't update shared collection ref
      entity.collection.update;
      // @ts-expect-error - Can't as shared collection ref
      entity.collection.as;
    }

    // @ts-expect-error - nope is not a valid field
    await entity.update({ active: true, nope: false });
    // @ts-expect-error - nope is not a valid field
    await entity.update({ nope: false });
    await entity.update({ active: true });
  }

  // Single model collection

  updateActive(123 as never);

  db.posts
    .get(db.posts.id("123"))
    .then((doc) => doc && updateActive(doc.as<SharedFields>()));

  db.posts
    .get(db.posts.id("123"))
    .then((doc) => doc && updateActive(doc.ref.as<SharedFields>()));

  db.addresses
    .get(db.addresses.id("123"))
    // @ts-expect-error - There's to active on the address
    .then((doc) => doc && updateActive(doc.as<SharedFields>()));

  // Variable model collection

  db.oauth
    .get(db.oauth.id("123"))
    .then((doc) => doc && updateActive(doc.as<SharedFields>()));

  db.content
    .get(db.content.id("123"))
    .then((doc) => doc && updateActive(doc.as<SharedFields>()));

  const localDb = schema(($) => ({
    accounts: $.collection<[TwitterAccount, LinkedInAccount]>(),
  }));

  localDb.accounts
    .get(localDb.accounts.id("123"))
    // @ts-expect-error - There's no shared active on the local's db account
    .then((doc) => doc && updateActive(doc.as<SharedFields>()));

  localDb.accounts
    .get(localDb.accounts.id("123"))
    // @ts-expect-error - There's no shared active on the local's db account
    .then((doc) => doc && updateActive(doc.ref.as<SharedFields>()));

  interface TwitterAccount {
    type: "twitter";
    screenName: number;
  }

  interface LinkedInAccount {
    type: "linkedin";
    email: string;
    active: true;
  }
}
//#endregion

async function sharedIds() {
  interface Settings {
    email: string;
  }

  const db = schema(($) => ({
    users: $.collection<User>(),
    settings: $.collection<Settings, Typesaurus.Id<"users">>(),
  }));

  const userId = await db.users.id();

  db.settings.update(userId, { email: "hello@example.com" });
}

// @tysts-start: strict - with strictNullChecks disabled the tysts fail

//#region InferSchema
async function inferSchema() {
  type Schema1 = Core.InferSchema<typeof db>;

  assertType<TypeEqual<Schema1["users"]["Id"], Typesaurus.Id<"users">>>(true);
  assertType<TypeEqual<Schema1["users"]["Ref"], Typesaurus.Ref<User, "users">>>(
    true,
  );
  assertType<TypeEqual<Schema1["users"]["Doc"], Typesaurus.Doc<User, "users">>>(
    true,
  );

  interface Settings {
    email: string;
  }

  const nestedDB = schema(($) => ({
    users: $.collection<User>().sub({
      settings: $.collection<Settings>(),
    }),
  }));

  type Schema2 = Core.InferSchema<typeof nestedDB>;

  assertType<
    TypeEqual<
      Schema2["users"]["sub"]["settings"]["Id"],
      Typesaurus.Id<"users/settings">
    >
  >(true);

  assertType<
    TypeEqual<
      Schema2["users"]["sub"]["settings"]["Ref"],
      Typesaurus.Ref<Settings, "settings", "users/settings">
    >
  >(true);

  assertType<
    TypeEqual<
      Schema2["users"]["sub"]["settings"]["Doc"],
      Typesaurus.Doc<Settings, "settings", "users/settings">
    >
  >(true);
}
//#endregion

//#region NarrowDoc
async function narrowDoc() {
  interface TwitterAccount {
    type: "twitter";
    screenName: number;
  }

  interface LinkedInAccount {
    type: "linkedin";
    email: string;
  }

  const localDb = schema(($) => ({
    accounts: $.collection<[TwitterAccount, LinkedInAccount]>(),
  }));

  type Schema = Core.InferSchema<typeof localDb>;

  type Result1 = Core.NarrowDoc<Schema["accounts"]["Doc"], TwitterAccount>;

  assertType<
    TypeEqual<
      Result1,
      Core.Doc<
        {
          Model: TwitterAccount;
          Name: "accounts";
          Id: Core.Id<"accounts">;
          WideModel: [TwitterAccount, LinkedInAccount];
          Flags: { Reduced: true; Shared: boolean };
        },
        Core.DocProps
      >
    >
  >(true);
}
//#endregion

async function edgeCases() {
  interface ServerChapter {}

  interface ServerChapterPost {
    chapterId: Schema["chapters"]["Id"];
  }

  const db = schema(($) => ({
    chapters: $.collection<ServerChapter>().sub({
      chapterPosts: $.collection<ServerChapterPost>(),
    }),
  }));

  type Schema = Typesaurus.Schema<typeof db>;

  const data = {} as Schema["chapters"]["sub"]["chapterPosts"]["Data"];
  const id: Schema["chapters"]["Id"] = data.chapterId;
  return id;
}

// @tysts-end: strict

namespace Data {
  // It does not mingle typed id

  type ResultOA8M = Core.Data<
    {
      helloId: Typesaurus.Id<"hello">;
    },
    "present"
  >;

  assertType<TypeEqual<ResultOA8M, { helloId: Typesaurus.Id<"hello"> }>>(true);
}

namespace ModelToConcat {
  // Both objects

  type ResultKA01 = Core.ConcatModel<{ hello: "hello" }, { world: "world" }>;

  assertType<TypeEqual<ResultKA01, [{ hello: "hello" }, { world: "world" }]>>(
    true,
  );

  // First is tuple

  type ResultU3HA = Core.ConcatModel<[{ hello: "hello" }], { world: "world" }>;

  assertType<TypeEqual<ResultU3HA, [{ hello: "hello" }, { world: "world" }]>>(
    true,
  );

  type ResultKJE7 = Core.ConcatModel<
    [{ hello: "hello" }, { cruel: "cruel" }],
    { world: "world" }
  >;

  assertType<
    TypeEqual<
      ResultKJE7,
      [{ hello: "hello" }, { cruel: "cruel" }, { world: "world" }]
    >
  >(true);

  // Second is tuple

  type ResultOOAN = Core.ConcatModel<{ hello: "hello" }, [{ world: "world" }]>;

  assertType<TypeEqual<ResultOOAN, [{ hello: "hello" }, { world: "world" }]>>(
    true,
  );

  type ResultPAN7 = Core.ConcatModel<
    { hello: "hello" },
    [{ cruel: "cruel" }, { world: "world" }]
  >;

  assertType<
    TypeEqual<
      ResultPAN7,
      [{ hello: "hello" }, { cruel: "cruel" }, { world: "world" }]
    >
  >(true);

  // Both are tuples

  type ResultWE8M = Core.ConcatModel<
    [{ hello: "hello" }],
    [{ world: "world" }]
  >;

  assertType<TypeEqual<ResultWE8M, [{ hello: "hello" }, { world: "world" }]>>(
    true,
  );

  type ResultFJU9 = Core.ConcatModel<
    [{ hello: "hello" }, { cruel: "cruel" }],
    [{ world: "world" }, { bang: "!" }]
  >;

  assertType<
    TypeEqual<
      ResultFJU9,
      [
        { hello: "hello" },
        { cruel: "cruel" },
        { world: "world" },
        { bang: "!" },
      ]
    >
  >(true);
}

namespace Types {
  type Schema = Typesaurus.Schema<typeof db>;

  type InferredId = Schema["users"]["Id"];
  ("" as InferredId).toLowerCase();

  type Id = Typesaurus.Id<"users">;
  ("" as Id).toLowerCase();
}

namespace Debrand {
  type Result1 = Assert<Utils.Debrand<string & { hello: "world" }>, string>;

  type Result2 = Assert<Utils.Debrand<number & { hello: "world" }>, number>;

  type Result3 = Assert<Utils.Debrand<symbol & { hello: "world" }>, symbol>;
}

namespace ComposePath {
  type Result1 = Assert<"users", Utils.ComposePath<false, "users">>;

  type Result2 = Assert<"users/posts", Utils.ComposePath<"users", "posts">>;
}

namespace UnionKeys {
  type Example = { books: true } | { comics: true };

  type Result = Assert<"books" | "comics", Utils.UnionKeys<Example>>;
}

namespace WithoutIndexed {
  type Example1 = {
    // @tysts-start: strict - without exactOptionalPropertyTypes it breaks
    [key: string]: string;
    // @tysts-end: strict
    /* @tysts-start: loose
    [key: string]: string | undefined
    @tysts-end: loose */
    required: string;
    optional?: string;
  };

  const test1 = {} as Utils.WithoutIndexed<Example1>;
  // @ts-expect-error
  type Result1 = (typeof test1)["qwe"];

  type ResultOk = (typeof test1)["required"];

  type Example2 = {
    [key: number]: string;
    required: string;
    optional?: string;
  };

  const test2 = {} as Utils.WithoutIndexed<Example2>;
  // @ts-expect-error
  type Result2 = (typeof test2)[123];

  type Example3 = {
    [key: symbol]: string;
    required: string;
    optional?: string;
  };

  const test3 = {} as Utils.WithoutIndexed<Example3>;
  // @ts-expect-error
  type Result3 = (typeof test3)[Symbol];

  type Example4 = {
    [key: string & { hello: "world" }]: string;
    required: string;
    optional?: string;
  };

  const test4 = {} as Utils.WithoutIndexed<Example4>;
  const id4 = "hello" as string & { hello: "world" };
  // @ts-expect-error
  type Result4 = (typeof test4)[id4];

  type Example5 = {
    [key: number & { hello: "world" }]: string;
    required: string;
    optional?: string;
  };

  const test5 = {} as Utils.WithoutIndexed<Example5>;
  const id5 = 123 as number & { hello: "world" };
  // @ts-expect-error
  type Result5 = (typeof test5)[id5];

  type Example6 = {
    [key: symbol & { hello: "world" }]: string;
    required: string;
    optional?: string;
  };

  const test6 = {} as Utils.WithoutIndexed<Example6>;
  const id6 = Symbol("hello") as symbol & { hello: "world" };
  // @ts-expect-error
  type Result6 = (typeof test6)[id6];
}

namespace StaticKey {
  type Example1 = {
    // @tysts-start: strict - without exactOptionalPropertyTypes it breaks
    [key: string]: string;
    // @tysts-end: strict
    /* @tysts-start: loose
    [key: string]: string | undefined
    @tysts-end: loose */
    required: string;
    optional?: string;
  };

  type Result11 = Assert<false, Utils.StaticKey<Example1, "qwe">>;

  type Result12 = Assert<true, Utils.StaticKey<Example1, "required">>;

  type Result13 = Assert<true, Utils.StaticKey<Example1, "optional">>;

  type Example2 = {
    [key: number]: string;
    required: string;
    optional?: string;
  };

  type Result21 = Assert<false, Utils.StaticKey<Example2, 123>>;

  type Result22 = Assert<true, Utils.StaticKey<Example2, "required">>;

  type Result23 = Assert<true, Utils.StaticKey<Example2, "optional">>;

  type Example3 = {
    [key: symbol]: string;
    required: string;
    optional?: string;
  };

  type Result31 = Assert<false, Utils.StaticKey<Example3, symbol>>;

  type Result32 = Assert<true, Utils.StaticKey<Example3, "required">>;

  type Result33 = Assert<true, Utils.StaticKey<Example3, "optional">>;
}

namespace UtilsTest {
  type Result1 = Assert<
    {
      required: string;
      optional: string;
    },
    Utils.AllRequired<{
      required: string;
      optional?: string;
    }>
  >;

  type Result2 = Assert<
    {
      required: string;
      optional: string;
    },
    Utils.AllRequired<{
      required: string;
      optional?: string | undefined;
    }>
  >;

  type Result3 = Assert<
    {
      required: string;
      optional: string;
    },
    Utils.AllRequired<{
      required: string;
      optional?: string | undefined | null;
    }>
  >;
}

namespace RequiredKey {
  interface Example1 {
    required: string;
    optional?: string;
  }

  type Result11 = Assert<true, Utils.RequiredKey<Example1, "required">>;

  type Result12 = Assert<false, Utils.RequiredKey<Example1, "optional">>;

  type Example2 = {
    // @tysts-start: strict - without exactOptionalPropertyTypes it breaks
    [key: string]: string;
    // @tysts-end: strict
    /* @tysts-start: loose
    [key: string]: string | undefined
    @tysts-end: loose */
    required: string;
    optional?: string;
  };

  type Result21 = Assert<false, Utils.RequiredKey<Example2, "qwe">>;

  type Result22 = Assert<true, Utils.RequiredKey<Example2, "required">>;

  type Result23 = Assert<false, Utils.RequiredKey<Example2, "optional">>;

  type Example3 = {
    [key: number]: string;
    required: string;
    optional?: string;
  };

  type Result31 = Assert<false, Utils.RequiredKey<Example3, 123>>;

  type Result32 = Assert<true, Utils.RequiredKey<Example3, "required">>;

  type Result33 = Assert<false, Utils.RequiredKey<Example3, "optional">>;

  type Example4 = {
    [key: symbol]: string;
    required: string;
    optional?: string;
  };

  type Result41 = Assert<false, Utils.RequiredKey<Example4, symbol>>;

  type Result42 = Assert<true, Utils.RequiredKey<Example4, "required">>;

  type Result43 = Assert<false, Utils.RequiredKey<Example4, "optional">>;
}

// @tysts-start: strict - without exactOptionalPropertyTypes it breaks
namespace ActuallyUndefined {
  interface Solid {
    ok: true;
  }

  interface UndefiendField {
    ok: true | undefined;
  }

  interface OptionalField {
    ok?: true;
  }

  interface OptionalUndefinedField {
    ok?: true | undefined;
  }

  interface DynamicUndefined {
    [key: string]: true | undefined;
  }

  interface Dynamic {
    [key: string]: true;
  }

  type Result1 = Assert<false, Utils.ActuallyUndefined<Solid, "ok">>;

  type Result2 = Assert<true, Utils.ActuallyUndefined<UndefiendField, "ok">>;

  type Result3 = Assert<false, Utils.ActuallyUndefined<OptionalField, "ok">>;

  type Result4 = Assert<
    true,
    Utils.ActuallyUndefined<OptionalUndefinedField, "ok">
  >;

  type Result6 = Assert<false, Utils.ActuallyUndefined<Dynamic, "ok">>;

  type Result7 = Assert<true, Utils.ActuallyUndefined<DynamicUndefined, "ok">>;
}
// @tysts-end: strict

namespace AllOptionalBut {
  interface Example1 {
    required: string;
    optional?: string;
  }

  type Result1 = Assert<true, Utils.AllOptionalBut<Example1, "required">>;

  type Result2 = Assert<false, Utils.AllOptionalBut<Example1, "optional">>;

  interface Example2 {
    required1: string;
    required2: string;
    optional?: string;
  }

  type Result3 = Assert<false, Utils.AllOptionalBut<Example2, "required1">>;

  type Result4 = Assert<false, Utils.AllOptionalBut<Example2, "required2">>;

  type Result5 = Assert<false, Utils.AllOptionalBut<Example2, "optional">>;

  interface Example3 {
    [postId: string]: {
      likes?: string;
      views?: string;
    };
  }

  type Result6 = Assert<true, Utils.AllOptionalBut<Example3, "post-id">>;

  interface Example4 {
    required: string;
    [optional: string]: string;
  }

  type Result7 = Assert<true, Utils.AllOptionalBut<Example4, "required">>;
}

namespace RequiredPath {
  interface Example2 {
    required: {
      required: string;
      optional?: string;
    };
    optional?: {
      required: string;
      optional?: string;
    };
  }

  type Result4 = Assert<true, Utils.RequiredPath1<Example2, "required">>;

  type Result7 = Assert<false, Utils.RequiredPath1<Example2, "optional">>;

  interface Example3 {
    optional?: {
      required: string;
      optional?: string;
    };
  }

  type Result8 = Assert<false, Utils.RequiredPath1<Example3, "optional">>;

  interface Example4 {
    required: {
      required: {
        required: string;
        optional?: string;
      };
      optional?: {
        required: string;
        optional?: string;
      };
    };
    optional?: {
      required: {
        required: string;
        optional?: string;
      };
      optional?: {
        required: string;
        optional?: string;
      };
    };
  }

  type Result10 = Assert<
    true,
    Utils.RequiredPath2<Example4, "required", "required">
  >;

  type Result12 = Assert<
    false,
    Utils.RequiredPath2<Example4, "required", "optional">
  >;

  type Result14 = Assert<
    false,
    Utils.RequiredPath2<Example4, "optional", "required">
  >;

  type Result16 = Assert<
    false,
    Utils.RequiredPath2<Example4, "optional", "optional">
  >;

  interface Example5 {
    1: {
      2: {
        3: {
          4: true;
        };
        optional?: {
          4: true;
        };
      };
    };
  }

  type Result18 = Assert<true, Utils.RequiredPath3<Example5, 1, 2, 3>>;

  type Result19 = Assert<
    false,
    Utils.RequiredPath3<Example5, 1, 2, "optional">
  >;

  interface Example6 {
    1: {
      2: {
        3: {
          4: {
            5: true;
          };
          optional?: {
            5: true;
          };
        };
      };
    };
  }

  type Result20 = Assert<true, Utils.RequiredPath4<Example6, 1, 2, 3, 4>>;

  type Result21 = Assert<
    false,
    Utils.RequiredPath4<Example6, 1, 2, 3, "optional">
  >;
}

namespace SafeOptionalPath {
  interface Example1 {
    required: string;
    optional?: string;
  }

  type Result1 = Assert<true, Utils.SafeOptionalPath1<Example1, "required">>;

  type Result2 = Assert<false, Utils.SafeOptionalPath1<Example1, "optional">>;

  type Result3 = Assert<
    false,
    Utils.SafeOptionalPath1<
      {
        required1: string;
        required2: string;
        optional?: string;
      },
      "required1"
    >
  >;

  interface Example2 {
    required: {
      required: string;
      optional?: string;
    };
    optional?: {
      required: string;
      optional?: string;
    };
  }

  type Result4 = Assert<
    true,
    Utils.SafeOptionalPath2<Example2, "required", "required">
  >;

  type Result5 = Assert<
    false,
    Utils.SafeOptionalPath2<Example2, "required", "optional">
  >;

  type Result6 = Assert<
    false,
    Utils.SafeOptionalPath2<Example2, "optional", "required">
  >;

  type Result7 = Assert<
    false,
    Utils.SafeOptionalPath2<Example2, "optional", "optional">
  >;

  interface Example3 {
    optional?: {
      required: string;
      optional?: string;
    };
  }

  type Result8 = Assert<
    true,
    Utils.SafeOptionalPath2<Example3, "optional", "required">
  >;

  type Result9 = Assert<
    false,
    Utils.SafeOptionalPath2<Example3, "optional", "optional">
  >;

  interface Example4 {
    required: {
      required: {
        required: string;
        optional?: string;
      };
      optional?: {
        required: string;
        optional?: string;
      };
    };
    optional?: {
      required: {
        required: string;
        optional?: string;
      };
      optional?: {
        required: string;
        optional?: string;
      };
    };
  }

  type Result10 = Assert<
    true,
    Utils.SafeOptionalPath3<Example4, "required", "required", "required">
  >;

  type Result11 = Assert<
    false,
    Utils.SafeOptionalPath3<Example4, "required", "required", "optional">
  >;

  type Result12 = Assert<
    false,
    Utils.SafeOptionalPath3<Example4, "required", "optional", "required">
  >;

  type Result13 = Assert<
    false,
    Utils.SafeOptionalPath3<Example4, "required", "optional", "optional">
  >;

  type Result14 = Assert<
    false,
    Utils.SafeOptionalPath3<Example4, "optional", "required", "required">
  >;

  type Result15 = Assert<
    false,
    Utils.SafeOptionalPath3<Example4, "optional", "required", "optional">
  >;

  type Result16 = Assert<
    false,
    Utils.SafeOptionalPath3<Example4, "optional", "optional", "required">
  >;

  type Result17 = Assert<
    false,
    Utils.SafeOptionalPath3<Example4, "optional", "optional", "optional">
  >;

  interface Example5 {
    optional?: {
      optional?: {
        required: string;
        optional?: string;
      };
    };
  }

  type Result18 = Assert<
    true,
    Utils.SafeOptionalPath3<Example5, "optional", "optional", "required">
  >;

  type Result19 = Assert<
    false,
    Utils.SafeOptionalPath3<Example5, "optional", "optional", "optional">
  >;
}

namespace SafePath {
  interface Example1 {
    required: string;
    optional?: string;
  }

  type Result1 = Assert<true, Utils.SafePath1<Example1, "required">>;

  type Result2 = Assert<true, Utils.SafePath1<Example1, "optional">>;

  type Result3 = Assert<
    true,
    Utils.SafePath1<
      {
        required1: string;
        required2: string;
        optional?: string;
      },
      "required1"
    >
  >;

  interface Example2 {
    required: {
      required: string;
      optional?: string;
    };
    optional?: {
      required: string;
      optional?: string;
    };
  }

  type Result4 = Assert<
    true,
    Utils.SafePath2<Example2, "required", "required">
  >;

  type Result5 = Assert<
    true,
    Utils.SafePath2<Example2, "required", "optional">
  >;

  type Result6 = Assert<
    true,
    Utils.SafePath2<Example2, "optional", "required">
  >;

  type Result7 = Assert<
    false,
    Utils.SafePath2<Example2, "optional", "optional">
  >;

  interface Example3 {
    optional?: {
      required: string;
      optional?: string;
    };
  }

  type Result8 = Assert<
    true,
    Utils.SafePath2<Example3, "optional", "required">
  >;

  type Result9 = Assert<
    false,
    Utils.SafePath2<Example3, "optional", "optional">
  >;

  interface Example4 {
    [postId: string]:
      | undefined
      | {
          likes?: number;
          views?: number;
        };
  }

  type Result10 = Assert<true, Utils.SafePath2<Example4, "post-id", "likes">>;

  interface Example5 {
    required: {
      required: {
        required: string;
        optional?: string;
      };
      optional?: {
        required: string;
        optional?: string;
      };
    };
    optional?: {
      required: {
        required: string;
        optional?: string;
      };
      optional?: {
        required: string;
        optional?: string;
      };
    };
  }

  type Result11 = Assert<
    true,
    Utils.SafePath3<Example5, "required", "required", "required">
  >;

  type Result12 = Assert<
    true,
    Utils.SafePath3<Example5, "required", "required", "optional">
  >;

  type Result13 = Assert<
    false,
    Utils.SafePath3<Example5, "required", "optional", "required">
  >;

  type Result14 = Assert<
    false,
    Utils.SafePath3<Example5, "required", "optional", "optional">
  >;

  type Result15 = Assert<
    true,
    Utils.SafePath3<Example5, "optional", "required", "required">
  >;

  type Result16 = Assert<
    false,
    Utils.SafePath3<Example5, "optional", "required", "optional">
  >;

  type Result17 = Assert<
    false,
    Utils.SafePath3<Example5, "optional", "optional", "required">
  >;

  type Result18 = Assert<
    false,
    Utils.SafePath3<Example5, "optional", "optional", "optional">
  >;

  interface Example6 {
    stats?: {
      [postId: string]:
        | undefined
        | {
            likes?: number;
            views?: number;
          };
    };
  }

  type Result19 = Assert<
    true,
    Utils.SafePath3<Example6, "stats", "post-id", "likes">
  >;

  interface ExampleAY40 {
    required: {
      optional1?: {
        optional1?: string;
        optional2?: string;
      };
      optional2?: {
        optional?: string;
        required: string;
      };
    };
  }

  type ResultQP8V = Assert<
    true,
    Utils.SafePath3<ExampleAY40, "required", "optional1", "optional1">
  >;

  type ResultAK3B = Assert<
    true,
    Utils.SafePath3<ExampleAY40, "required", "optional1", "optional2">
  >;

  type ResultAXJR = Assert<
    false,
    Utils.SafePath3<ExampleAY40, "required", "optional2", "optional">
  >;

  type Result92GA = Assert<
    true,
    Utils.SafePath3<ExampleAY40, "required", "optional2", "required">
  >;

  interface ExampleLD18 {
    optional?: {
      optional1?: {
        optional1?: string;
        optional2?: string;
      };
      optional2?: {
        optional?: string;
        required: string;
      };
    };
  }

  type ResultA45H = Assert<
    true,
    Utils.SafePath3<ExampleLD18, "optional", "optional1", "optional1">
  >;

  type Result49SU = Assert<
    true,
    Utils.SafePath3<ExampleLD18, "optional", "optional1", "optional2">
  >;

  type ResultDM3H = Assert<
    false,
    Utils.SafePath3<ExampleLD18, "optional", "optional2", "optional">
  >;

  type ResultTJ32 = Assert<
    true,
    Utils.SafePath3<ExampleLD18, "optional", "optional2", "required">
  >;

  interface Example7 {
    1: {
      2: {
        3: {
          required: string;
          optional?: string;
        };
      };
    };

    one?: {
      2: {
        3: {
          required: string;
          optional?: string;
        };
      };
    };

    uno?: {
      dos: string;
      2: {
        3: {
          required: string;
          optional?: string;
        };
      };
    };
  }

  type Result20 = Assert<true, Utils.SafePath4<Example7, 1, 2, 3, "required">>;

  type Result21 = Assert<true, Utils.SafePath4<Example7, 1, 2, 3, "optional">>;

  type Result22 = Assert<
    true,
    Utils.SafePath4<Example7, "one", 2, 3, "required">
  >;

  type Result23 = Assert<
    false,
    Utils.SafePath4<Example7, "one", 2, 3, "optional">
  >;

  type Result24 = Assert<
    false,
    Utils.SafePath4<Example7, "uno", 2, 3, "required">
  >;

  type Result25 = Assert<
    false,
    Utils.SafePath4<Example7, "uno", 2, 3, "optional">
  >;

  interface Example8 {
    stats?: {
      [postId: string]:
        | undefined
        | {
            [commentId: string]:
              | undefined
              | {
                  likes?: number;
                  views?: number;
                };
          };
    };
  }

  type Result26 = Assert<
    true,
    Utils.SafePath4<Example8, "stats", "post-id", "comment-id", "likes">
  >;
}

namespace SharedShape {
  type ResultOD83 = Utils.SharedShape<
    { a: string | number; b: string; c: boolean },
    {
      a: string;
      b: string;
    }
  >;

  type Result43J3 = Assert<{ a: string; b: string }, ResultOD83>;

  type ResultISB3 = Utils.SharedShape<
    { a: string | number; b: string; c: boolean },
    {
      a: string;
      b: string;
    },
    {
      a: string;
    }
  >;
  type ResultUSJ7 = Assert<{ a: string }, ResultISB3>;
}

namespace NormalizeServerDates {
  type ResultIR93 = Core.NormalizeServerDates<{
    a: string;
    b: Typesaurus.ServerDate;
    c: Array<{
      d: Typesaurus.ServerDate;
      e: boolean;
    }>;
    f: {
      g: Typesaurus.ServerDate;
      h: number;
    };
  }>;

  type Result1 = Assert<
    {
      a: string;
      b: Date;
      c: Array<{
        d: Date;
        e: boolean;
      }>;
      f: {
        g: Date;
        h: number;
      };
    },
    ResultIR93
  >;

  type Result2 = Assert<number, Core.NormalizeServerDates<number>>;

  type asd = Core.NormalizeServerDates<OpaqueString>;

  type Result3 = Assert<OpaqueString, Core.NormalizeServerDates<OpaqueString>>;

  type Result4 = Assert<OpaqueTypes, Core.NormalizeServerDates<OpaqueTypes>>;
}

namespace Nullify {
  type Result1 = Assert<null, Core.Nullify<null>>;

  type Result2 = Assert<undefined | null, Core.Nullify<undefined | null>>;

  type Result3 = Assert<number, Core.Nullify<number>>;

  type Result4 = Assert<
    number | undefined | null,
    Core.Nullify<number | undefined>
  >;

  type Result5 = Assert<Date, Core.Nullify<Date>>;

  type Result6 = Assert<
    Date | undefined | null,
    Core.Nullify<Date | undefined>
  >;

  type Result7 = Assert<Date | null, Core.Nullify<Date | null>>;

  type Result8 = Assert<
    Date | null | { hello: "world" },
    Core.Nullify<Date | null | { hello: "world" }>
  >;

  type Result9 = Assert<
    Date | null | { hello: "world"; cruel?: true | undefined | null },
    Core.Nullify<Date | null | { hello: "world"; cruel: true | undefined }>
  >;

  type Result10 = Assert<
    Date | null | { hello: "world"; cruel?: true | undefined | null },
    Core.Nullify<Date | null | { hello: "world"; cruel?: true | undefined }>
  >;

  type Result11 = Assert<
    Date | null | { hello: "world"; cruel?: true },
    Core.Nullify<Date | null | { hello: "world"; cruel?: true }>
  >;

  type Result12 = Assert<
    (Date | null | { hello: "world"; cruel?: true | undefined | null })[],
    Core.Nullify<(Date | null | { hello: "world"; cruel: true | undefined })[]>
  >;

  type Result13 = Assert<
    { [key: string]: boolean },
    Core.Nullify<{ [key: string]: boolean }>
  >;

  type Result14 = Assert<
    { [key: string]: boolean | undefined | null },
    Core.Nullify<{ [key: string]: boolean | undefined }>
  >;
}

async function record() {
  const account = await db.accounts.get(db.accounts.id("ok"));
  if (!account) return;

  account.data.counters &&
    Object.entries(account.data.counters).forEach(([_postId, counters]) => {
      counters.likes;
    });

  await db.accounts.update(db.accounts.id("ok"), ($) => [
    $.field("nested", "counters", "post-id" as PostId).set($.remove()),
  ]);
}

type Assert<Type1, _Type2 extends Type1> = true;

export function assertType<Type>(value: Type) {}

export type TypeEqual<T, U> =
  Exclude<T, U> extends never
    ? Exclude<U, T> extends never
      ? true
      : false
    : false;
