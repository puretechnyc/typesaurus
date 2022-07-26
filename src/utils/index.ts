import type { Typesaurus } from '..'

export namespace TypesaurusUtils {
  /**
   * Returns a type with all fields required and all values exclude undefined.
   * It allows to extract key paths from nested objects with optional keys
   * and values.
   */
  export type AllRequired<Model> = {
    [Key in keyof Required<Model>]-?: Exclude<Required<Model>[Key], undefined>
  }

  /**
   * Resolves true if the passed key is a required field of the passed model.
   */
  export type RequiredKey<Model, Key extends keyof Model> = Partial<
    Pick<Model, Key>
  > extends Pick<Model, Key>
    ? false
    : true

  /**
   * Resolves true if all rest keys in the passed model are optional.
   */
  export type AllOptionalBut<Model, Key extends keyof Model> = Partial<
    Omit<Model, Key>
  > extends Omit<Model, Key>
    ? true
    : false

  export type RequiredPath1<Model, _Key1 extends keyof Model> = true

  export type RequiredPath2<
    Model,
    Key1 extends keyof Model,
    _Key2 extends keyof AllRequired<Model>[Key1]
  > = RequiredKey<Model, Key1> extends true ? true : false

  export type RequiredPath3<
    Model,
    Key1 extends keyof Model,
    Key2 extends keyof AllRequired<Model>[Key1],
    _Key3 extends keyof AllRequired<AllRequired<Model>[Key1]>[Key2]
  > = RequiredPath2<Model, Key1, Key2> extends true
    ? RequiredKey<AllRequired<Model>[Key1], Key2> extends true
      ? true
      : false
    : false

  export type RequiredPath4<
    Model,
    Key1 extends keyof Model,
    Key2 extends keyof AllRequired<Model>[Key1],
    Key3 extends keyof AllRequired<AllRequired<Model>[Key1]>[Key2],
    _Key4 extends keyof AllRequired<
      AllRequired<AllRequired<Model>[Key1]>[Key2]
    >[Key3]
  > = RequiredPath3<Model, Key1, Key2, Key3> extends true
    ? RequiredKey<
        AllRequired<AllRequired<Model>[Key1]>[Key2],
        Key3
      > extends true
      ? true
      : false
    : false

  export type RequiredPath5<
    Model,
    Key1 extends keyof Model,
    Key2 extends keyof AllRequired<Model>[Key1],
    Key3 extends keyof AllRequired<AllRequired<Model>[Key1]>[Key2],
    Key4 extends keyof AllRequired<
      AllRequired<AllRequired<Model>[Key1]>[Key2]
    >[Key3],
    _Key5 extends keyof AllRequired<
      AllRequired<AllRequired<AllRequired<Model>[Key1]>[Key2]>[Key3]
    >[Key4]
  > = RequiredPath4<Model, Key1, Key2, Key3, Key4> extends true
    ? RequiredKey<
        AllRequired<AllRequired<AllRequired<Model>[Key1]>[Key2]>[Key3],
        Key4
      > extends true
      ? true
      : false
    : false

  export type SafeOptionalPath1<
    Model,
    Key1 extends keyof Model
  > = AllOptionalBut<Model, Key1> extends true ? true : false

  export type SafeOptionalPath2<
    Model,
    Key1 extends keyof Model,
    Key2 extends keyof AllRequired<Model>[Key1]
  > = SafeOptionalPath1<Model, Key1> extends true
    ? AllOptionalBut<AllRequired<Model>[Key1], Key2> extends true
      ? true
      : false
    : false

  export type SafeOptionalPath3<
    Model,
    Key1 extends keyof Model,
    Key2 extends keyof AllRequired<Model>[Key1],
    Key3 extends keyof AllRequired<AllRequired<Model>[Key1]>[Key2]
  > = SafeOptionalPath2<Model, Key1, Key2> extends true
    ? AllOptionalBut<
        AllRequired<AllRequired<Model>[Key1]>[Key2],
        Key3
      > extends true
      ? true
      : false
    : false

  export type SafePath1<Model, _Key1 extends keyof Model> = true

  export type SafePath2<
    Model,
    Key1 extends keyof Model,
    Key2 extends keyof AllRequired<Model>[Key1]
  > = RequiredPath2<Model, Key1, Key2> extends true
    ? true
    : AllOptionalBut<AllRequired<Model>[Key1], Key2> extends true
    ? true
    : false

  export type SafePath3<
    Model,
    Key1 extends keyof Model,
    Key2 extends keyof AllRequired<Model>[Key1],
    Key3 extends keyof AllRequired<AllRequired<Model>[Key1]>[Key2]
  > = RequiredPath3<Model, Key1, Key2, Key3> extends true
    ? true
    : RequiredPath2<Model, Key1, Key2> extends true
    ? SafeOptionalPath1<AllRequired<AllRequired<Model>[Key1]>[Key2], Key3>
    : SafeOptionalPath2<AllRequired<Model>[Key1], Key2, Key3>

  export type SafePath4<
    Model,
    Key1 extends keyof Model,
    Key2 extends keyof AllRequired<Model>[Key1],
    Key3 extends keyof AllRequired<AllRequired<Model>[Key1]>[Key2],
    Key4 extends keyof AllRequired<
      AllRequired<AllRequired<Model>[Key1]>[Key2]
    >[Key3]
  > = RequiredPath4<Model, Key1, Key2, Key3, Key4> extends true
    ? true
    : RequiredPath3<Model, Key1, Key2, Key3> extends true
    ? SafeOptionalPath1<
        AllRequired<AllRequired<AllRequired<Model>[Key1]>[Key2]>[Key3],
        Key4
      >
    : RequiredPath2<Model, Key1, Key2> extends true
    ? SafeOptionalPath2<
        AllRequired<AllRequired<AllRequired<Model>[Key1]>[Key2]>,
        Key3,
        Key4
      >
    : SafeOptionalPath3<AllRequired<Model>[Key1], Key2, Key3, Key4>

  export type SubscriptionPromiseGet<Result> = () => Promise<Result>

  export type SubscriptionPromiseResultCallback<Result> = (
    result: Result
  ) => void

  export type SubscriptionPromiseErrorCallback = (error: Error) => void

  export type SubscriptionPromiseSubscribe<Result> = (
    resultCallback: SubscriptionPromiseResultCallback<Result>,
    errorCallback: SubscriptionPromiseErrorCallback
  ) => Typesaurus.OffSubscription

  export interface SubscriptionPromiseProps<Result> {
    get: SubscriptionPromiseGet<Result>
    subscribe: SubscriptionPromiseSubscribe<Result>
  }

  export interface SubscriptionPromiseSubscriptions<Result> {
    result: SubscriptionPromiseResultCallback<Result>[]
    error: SubscriptionPromiseErrorCallback[]
  }

  export class SubscriptionPromise<Result>
    implements Typesaurus.SubscriptionPromise<Result>
  {
    private result: Result | undefined

    private error: unknown

    private get: SubscriptionPromiseGet<Result>

    private subscribe: SubscriptionPromiseSubscribe<Result>

    private promise: Promise<Result> | undefined

    private off: (() => void) | undefined

    private subscriptions: SubscriptionPromiseSubscriptions<Result>

    constructor({ get, subscribe }: SubscriptionPromiseProps<Result>) {
      this.get = get
      this.subscribe = subscribe
      this.subscriptions = { result: [], error: [] }
    }

    get [Symbol.toStringTag]() {
      return '[object SubscriptionPromise]'
    }

    then<FullfillResult = Result, RejectResult = never>(
      onFulfilled?:
        | ((value: Result) => FullfillResult | PromiseLike<FullfillResult>)
        | undefined
        | null,
      onRejected?:
        | ((reason: any) => RejectResult | PromiseLike<RejectResult>)
        | undefined
        | null
    ): Promise<FullfillResult | RejectResult> {
      return this.resolve().then(onFulfilled, onRejected)
    }

    catch<CatchResult = never>(
      onRejected?:
        | ((reason: any) => CatchResult | PromiseLike<CatchResult>)
        | undefined
        | null
    ): Promise<Result | CatchResult> {
      return this.resolve().catch(onRejected)
    }

    finally(onFinally?: (() => void) | null | undefined): Promise<Result> {
      return this.resolve().finally(onFinally)
    }

    on(
      callback: Typesaurus.SubscriptionPromiseCallback<Result>
    ): Typesaurus.OffSubscriptionWithCatch {
      if (this.promise) throw new Error("Can't subscribe after awaiting")

      this.subscriptions.result.push(callback)

      if (this.off) {
        if (this.result) callback(this.result)
      } else {
        this.off = this.subscribe(
          (result) => {
            this.result = result
            this.subscriptions.result.forEach((callback) => callback(result))
          },
          (error) => {
            this.error = error
            this.subscriptions.error.forEach((callback) => callback(error))
          }
        )
      }

      const off = () => {
        const index = this.subscriptions.result.indexOf(callback)
        if (index !== -1) this.subscriptions.result.splice(index, 1)

        if (
          !this.subscriptions.result.length &&
          !this.subscriptions.error.length
        ) {
          this.off?.()
          this.off = undefined
        }
      }

      const offWithCatch = (() => {
        off()
      }) as Typesaurus.OffSubscriptionWithCatch

      offWithCatch.catch = (callback) => {
        if (this.error) callback(this.error)
        this.subscriptions.error.push(callback)

        return () => {
          const index = this.subscriptions.error.indexOf(callback)
          if (index !== -1) this.subscriptions.error.splice(index, 1)

          off()
        }
      }

      return offWithCatch
    }

    private resolve() {
      if (this.off)
        return Promise.reject(new Error("Can't await after subscribing"))

      if (this.result) return Promise.resolve(this.result)
      if (this.error) return Promise.reject(this.error)
      if (this.promise) return this.promise

      try {
        this.promise = this.get()
          .then((result) => {
            this.result = result
            return result
          })
          .catch((error) => {
            this.error = error
            throw error
          })
        return this.promise
      } catch (error) {
        this.error = error
        return Promise.reject(error)
      }
    }
  }
}