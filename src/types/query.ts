import type { TypesaurusUtils as Utils } from './utils.js'
import type { TypesaurusCore as Core } from './core.js'

export namespace TypesaurusQuery {
  export interface Function<Def extends Core.DocDef> {
    <
      Environment extends Core.RuntimeEnvironment,
      Props extends Core.DocProps & { environment: Environment },
      Getter extends TypesaurusQuery.Getter<Def>
    >(
      queries: Getter,
      options?: Core.ReadOptions<Environment, Props>
    ): Getter extends ($: Helpers<Def>) => infer Result
      ? Result extends Utils.Falsy
        ? // Enable empty query to signal that the query is not ready. It allows
          // wrappers like Typesaurus React to know that it's not ready
          // to perform, e.g., when a dependency fetch is in progress or
          // the user is not authenticated. Since it's a function,
          // it's impossible towrap the query into a check because the check
          // will be invalid inside the function.
          undefined
        : SubscriptionPromise<Def, Environment, Props>
      : never

    build<
      Environment extends Core.RuntimeEnvironment,
      Props extends Core.DocProps & { environment: Environment }
    >(
      options?: Core.ReadOptions<Environment, Props>
    ): Builder<Def, Props>
  }

  export interface SubscriptionPromise<
    Def extends Core.DocDef,
    Environment extends Core.RuntimeEnvironment,
    Props extends Core.DocProps & { environment: Environment }
  > extends Core.SubscriptionPromise<
      Core.QueryRequest,
      Core.Doc<Def, Props>[],
      Core.SubscriptionListMeta<Def, Props>
    > {
    count(): Promise<number>
  }

  export type Data<Model extends Core.ModelType> =
    | Query<Model>
    | Array<Query<Model> | Utils.Falsy>
    | Utils.Falsy

  export type Getter<Def extends Core.DocDef> = (
    $: Helpers<Def>
  ) => Data<Def['Model']>

  /**
   * Query helpers object avaliable in the `query` function.
   */
  export interface Helpers<Def extends Core.DocDef>
    extends CommonQueryHelpers<
      Def,
      Core.IntersectVariableModelType<Def['Model']>,
      OrderQuery<Def['Model']>,
      WhereQuery<Def['Model']>,
      LimitQuery<Def['Model']>
    > {}

  /**
   * Query builder works like regular query helpers, but the run can be delayed
   * and mixed with other code.
   */
  export interface Builder<Def extends Core.DocDef, Props extends Core.DocProps>
    extends CommonQueryHelpers<
      Def,
      Core.IntersectVariableModelType<Def['Model']>,
      void,
      void,
      void
    > {
    /**
     * Runs the built query.
     */
    run(): Core.SubscriptionPromise<
      Core.QueryRequest,
      Core.Doc<Def, Props>[],
      Core.SubscriptionListMeta<Def, Props>
    >
  }

  export type DocId = '__id__'

  export type OrderDirection = 'desc' | 'asc'

  export type WhereFilter =
    | '<'
    | '<='
    | '=='
    | '!='
    | '>='
    | '>'
    | 'in'
    | 'not-in'
    | 'array-contains'
    | 'array-contains-any'

  /**
   * The query type.
   */
  export type Query<Model> =
    | OrderQuery<Model>
    | WhereQuery<Model>
    | LimitQuery<Model>

  /**
   * The order query type. Used to build query.
   */
  export interface OrderQuery<_Model> {
    type: 'order'
    field: string[]
    method: OrderDirection
    cursors: OrderCursors<Core.DocDef, any, any>
  }

  export interface WhereQuery<_Model> {
    type: 'where'
    field: string[] | [DocId]
    filter: WhereFilter
    value: any
  }

  /**
   * The limit query type. It contains the limit value.
   */
  export interface LimitQuery<_Model> {
    type: 'limit'
    number: number
  }

  export type OrderCursors<
    Def extends Core.DocDef,
    Parent,
    Key extends QueryFieldKey1<Parent> | DocId
  > =
    | Utils.Falsy
    | OrderCursorStart<Def, Parent, Key>
    | [OrderCursorStart<Def, Parent, Key> | Utils.Falsy]
    | OrderCursorEnd<Def, Parent, Key>
    | [OrderCursorEnd<Def, Parent, Key> | Utils.Falsy]
    | [
        OrderCursorStart<Def, Parent, Key> | Utils.Falsy,
        OrderCursorEnd<Def, Parent, Key> | Utils.Falsy
      ]

  export type OrderCursorsEmpty = undefined | null | '' | false | []

  export type OrderCursorPosition =
    | 'startAt'
    | 'startAfter'
    | 'endBefore'
    | 'endAt'

  export type OrderCursorStart<
    Def extends Core.DocDef,
    Parent,
    Key extends QueryFieldKey1<Parent> | DocId
  > =
    | OrderCursorStartAt<Def, Parent, Key>
    | OrderCursorStartAfter<Def, Parent, Key>

  export interface OrderCursorStartAt<
    Def extends Core.DocDef,
    Parent,
    Key extends QueryFieldKey1<Parent> | DocId
  > extends OrderCursor<Def, Parent, Key, 'startAt'> {}

  export interface OrderCursorStartAfter<
    Def extends Core.DocDef,
    Parent,
    Key extends QueryFieldKey1<Parent> | DocId
  > extends OrderCursor<Def, Parent, Key, 'startAfter'> {}

  export type OrderCursorEnd<
    Def extends Core.DocDef,
    Parent,
    Key extends QueryFieldKey1<Parent> | DocId
  > =
    | OrderCursorEndAt<Def, Parent, Key>
    | OrderCursorEndBefore<Def, Parent, Key>

  export interface OrderCursorEndAt<
    Def extends Core.DocDef,
    Parent,
    Key extends QueryFieldKey1<Parent> | DocId
  > extends OrderCursor<Def, Parent, Key, 'endAt'> {}

  export interface OrderCursorEndBefore<
    Def extends Core.DocDef,
    Parent,
    Key extends QueryFieldKey1<Parent> | DocId
  > extends OrderCursor<Def, Parent, Key, 'endBefore'> {}

  export interface OrderCursor<
    Def extends Core.DocDef,
    Parent,
    Key extends QueryFieldKey1<Parent> | DocId,
    Position extends OrderCursorPosition
  > {
    type: 'cursor'
    position: Position
    value: OrderCursorValue<Def, Parent, Key>
  }

  export type OrderCursorValue<
    Def extends Core.DocDef,
    Parent,
    Key extends QueryFieldKey1<Parent> | DocId
  > =
    | (Key extends QueryFieldKey1<Parent>
        ? QueryFieldValue<QueryFieldGet1<Parent, Key>>
        : Def['Id']) // Field value or id
    | Core.Doc<Def, Core.DocProps> // Will be used to get value for the cursor
    | undefined // Indicates the start of the query

  export interface QueryFieldBase<
    Def extends Core.DocDef,
    Parent,
    Key extends QueryFieldKey1<Parent> | DocId,
    OrderQueryResult
  > {
    // With cursors
    order(cursors?: OrderCursors<Def, Parent, Key> | []): OrderQueryResult

    // With method and cursors
    order(
      method: OrderDirection,
      cursors?: OrderCursors<Def, Parent, Key> | []
    ): OrderQueryResult
  }

  export interface QueryIdField<
    Def extends Core.DocDef,
    OrderQueryResult,
    WhereQueryResult
  > extends QueryFieldBase<Def, Def['Model'], DocId, OrderQueryResult> {
    lt(id: Def['Id']): WhereQueryResult

    lte(id: Def['Id']): WhereQueryResult

    eq(id: Def['Id']): WhereQueryResult

    not(id: Def['Id']): WhereQueryResult

    gt(id: Def['Id']): WhereQueryResult

    gte(id: Def['Id']): WhereQueryResult

    in(ids: Def['Id'][]): WhereQueryResult

    notIn(ids: Def['Id'][]): WhereQueryResult
  }

  export interface QueryPrimitiveField<
    Def extends Core.DocDef,
    Parent,
    Key extends QueryFieldKey1<Parent>,
    OrderQueryResult,
    WhereQueryResult
  > extends QueryFieldBase<Def, Parent, Key, OrderQueryResult> {
    lt(field: QueryFieldValue<QueryFieldGet1<Parent, Key>>): WhereQueryResult

    lte(field: QueryFieldValue<QueryFieldGet1<Parent, Key>>): WhereQueryResult

    eq(field: QueryFieldValue<QueryFieldGet1<Parent, Key>>): WhereQueryResult

    not(field: QueryFieldValue<QueryFieldGet1<Parent, Key>>): WhereQueryResult

    gt(field: QueryFieldValue<QueryFieldGet1<Parent, Key>>): WhereQueryResult

    gte(field: QueryFieldValue<QueryFieldGet1<Parent, Key>>): WhereQueryResult

    in(fields: QueryFieldValue<QueryFieldGet1<Parent, Key>>[]): WhereQueryResult

    notIn(
      fields: QueryFieldValue<QueryFieldGet1<Parent, Key>>[]
    ): WhereQueryResult
  }

  export interface QueryArrayField<
    Parent,
    Key extends QueryFieldKey1<Parent>,
    WhereQueryResult
  > {
    contains(
      field: Exclude<QueryFieldGet1<Parent, Key>, undefined> extends Array<
        infer ItemType
      >
        ? QueryFieldValue<ItemType>
        : never
    ): WhereQueryResult

    containsAny(
      field: Exclude<QueryFieldGet1<Parent, Key>, undefined> extends Array<any>
        ? QueryFieldValue<QueryFieldGet1<Parent, Key>>
        : never
    ): WhereQueryResult
  }

  export type QueryField<
    Def extends Core.DocDef,
    Parent,
    Key extends QueryFieldKey1<Parent>,
    OrderQueryResult,
    WhereQueryResult
  > = Exclude<QueryFieldGet1<Parent, Key>, undefined> extends Array<any>
    ? QueryArrayField<Parent, Key, WhereQueryResult>
    : QueryPrimitiveField<Def, Parent, Key, OrderQueryResult, WhereQueryResult>

  export type QueryFieldValue<Value> = Exclude<
    Value,
    undefined
  > extends Core.ServerDate
    ? Exclude<Value, Core.ServerDate> | Date
    : Value

  /**
   * Common query helpers API with query object result passed as a generic.
   */
  export interface CommonQueryHelpers<
    Def extends Core.DocDef,
    Model extends Core.ModelObjectType,
    OrderQueryResult,
    WhereQueryResult,
    LimitQueryResult
  > {
    /**
     * Id selector, allows querying by the document id.
     */
    field(id: DocId): QueryIdField<Def, OrderQueryResult, LimitQueryResult>

    /**
     * Field selector, allows querying by a specific field.
     */
    field<Key extends QueryFieldKey1<Model>>(
      key: Key
    ): QueryField<Def, Model, Key, OrderQueryResult, WhereQueryResult>

    /**
     * Field selector, allows querying by a specific field.
     */
    field<
      Key1 extends QueryFieldKey1<Model>,
      Key2 extends QueryFieldKey2<Model, Key1>
    >(
      key1: Key1,
      key2: Key2
    ): QueryField<
      Def,
      QueryFieldGet1<Model, Key1>,
      Key2,
      OrderQueryResult,
      WhereQueryResult
    >

    /**
     * Field selector, allows querying by a specific field.
     */
    field<
      Key1 extends QueryFieldKey1<Model>,
      Key2 extends QueryFieldKey2<Model, Key1>,
      Key3 extends QueryFieldKey3<Model, Key1, Key2>
    >(
      key1: Key1,
      key2: Key2,
      key3: Key3
    ): QueryField<
      Def,
      QueryFieldGet2<Model, Key1, Key2>,
      Key3,
      OrderQueryResult,
      WhereQueryResult
    >

    /**
     * Field selector, allows querying by a specific field.
     */
    field<
      Key1 extends QueryFieldKey1<Model>,
      Key2 extends QueryFieldKey2<Model, Key1>,
      Key3 extends QueryFieldKey3<Model, Key1, Key2>,
      Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>
    >(
      key1: Key1,
      key2: Key2,
      key3: Key3,
      key4: Key4
    ): QueryField<
      Def,
      QueryFieldGet3<Model, Key1, Key2, Key3>,
      Key4,
      OrderQueryResult,
      WhereQueryResult
    >

    /**
     * Field selector, allows querying by a specific field.
     */
    field<
      Key1 extends QueryFieldKey1<Model>,
      Key2 extends QueryFieldKey2<Model, Key1>,
      Key3 extends QueryFieldKey3<Model, Key1, Key2>,
      Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
      Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>
    >(
      key1: Key1,
      key2: Key2,
      key3: Key3,
      key4: Key4,
      key5: Key5
    ): QueryField<
      Def,
      QueryFieldGet4<Model, Key1, Key2, Key3, Key4>,
      Key5,
      OrderQueryResult,
      WhereQueryResult
    >

    /**
     * Field selector, allows querying by a specific field.
     */
    field<
      Key1 extends QueryFieldKey1<Model>,
      Key2 extends QueryFieldKey2<Model, Key1>,
      Key3 extends QueryFieldKey3<Model, Key1, Key2>,
      Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
      Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
      Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>
    >(
      key1: Key1,
      key2: Key2,
      key3: Key3,
      key4: Key4,
      key5: Key5,
      key6: Key6
    ): QueryField<
      Def,
      QueryFieldGet5<Model, Key1, Key2, Key3, Key4, Key5>,
      Key6,
      OrderQueryResult,
      WhereQueryResult
    >

    /**
     * Field selector, allows querying by a specific field.
     */
    field<
      Key1 extends QueryFieldKey1<Model>,
      Key2 extends QueryFieldKey2<Model, Key1>,
      Key3 extends QueryFieldKey3<Model, Key1, Key2>,
      Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
      Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
      Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>,
      Key7 extends QueryFieldKey7<Model, Key1, Key2, Key3, Key4, Key5, Key6>
    >(
      key1: Key1,
      key2: Key2,
      key3: Key3,
      key4: Key4,
      key5: Key5,
      key6: Key6,
      key7: Key7
    ): QueryField<
      Def,
      QueryFieldGet6<Model, Key1, Key2, Key3, Key4, Key5, Key6>,
      Key7,
      OrderQueryResult,
      WhereQueryResult
    >

    /**
     * Field selector, allows querying by a specific field.
     */
    field<
      Key1 extends QueryFieldKey1<Model>,
      Key2 extends QueryFieldKey2<Model, Key1>,
      Key3 extends QueryFieldKey3<Model, Key1, Key2>,
      Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
      Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
      Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>,
      Key7 extends QueryFieldKey7<Model, Key1, Key2, Key3, Key4, Key5, Key6>,
      Key8 extends QueryFieldKey8<
        Model,
        Key1,
        Key2,
        Key3,
        Key4,
        Key5,
        Key6,
        Key7
      >
    >(
      key1: Key1,
      key2: Key2,
      key3: Key3,
      key4: Key4,
      key5: Key5,
      key6: Key6,
      key7: Key7,
      key8: Key8
    ): QueryField<
      Def,
      QueryFieldGet7<Model, Key1, Key2, Key3, Key4, Key5, Key6, Key7>,
      Key8,
      OrderQueryResult,
      WhereQueryResult
    >

    /**
     * Field selector, allows querying by a specific field.
     */
    field<
      Key1 extends QueryFieldKey1<Model>,
      Key2 extends QueryFieldKey2<Model, Key1>,
      Key3 extends QueryFieldKey3<Model, Key1, Key2>,
      Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
      Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
      Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>,
      Key7 extends QueryFieldKey7<Model, Key1, Key2, Key3, Key4, Key5, Key6>,
      Key8 extends QueryFieldKey8<
        Model,
        Key1,
        Key2,
        Key3,
        Key4,
        Key5,
        Key6,
        Key7
      >,
      Key9 extends QueryFieldKey9<
        Model,
        Key1,
        Key2,
        Key3,
        Key4,
        Key5,
        Key6,
        Key7,
        Key8
      >
    >(
      key1: Key1,
      key2: Key2,
      key3: Key3,
      key4: Key4,
      key5: Key5,
      key6: Key6,
      key7: Key7,
      key8: Key8,
      key9: Key9
    ): QueryField<
      Def,
      QueryFieldGet8<Model, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8>,
      Key9,
      OrderQueryResult,
      WhereQueryResult
    >

    /**
     * Field selector, allows querying by a specific field.
     */
    field<
      Key1 extends QueryFieldKey1<Model>,
      Key2 extends QueryFieldKey2<Model, Key1>,
      Key3 extends QueryFieldKey3<Model, Key1, Key2>,
      Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
      Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
      Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>,
      Key7 extends QueryFieldKey7<Model, Key1, Key2, Key3, Key4, Key5, Key6>,
      Key8 extends QueryFieldKey8<
        Model,
        Key1,
        Key2,
        Key3,
        Key4,
        Key5,
        Key6,
        Key7
      >,
      Key9 extends QueryFieldKey9<
        Model,
        Key1,
        Key2,
        Key3,
        Key4,
        Key5,
        Key6,
        Key7,
        Key8
      >,
      Key10 extends QueryFieldKey10<
        Model,
        Key1,
        Key2,
        Key3,
        Key4,
        Key5,
        Key6,
        Key7,
        Key8,
        Key9
      >
    >(
      key1: Key1,
      key2: Key2,
      key3: Key3,
      key4: Key4,
      key5: Key5,
      key6: Key6,
      key7: Key7,
      key8: Key8,
      key9: Key9,
      key10: Key10
    ): QueryField<
      Def,
      QueryFieldGet9<
        Model,
        Key1,
        Key2,
        Key3,
        Key4,
        Key5,
        Key6,
        Key7,
        Key8,
        Key9
      >,
      Key10,
      OrderQueryResult,
      WhereQueryResult
    >

    limit(to: number): LimitQueryResult

    startAt<Parent, Key extends QueryFieldKey1<Parent> | DocId>(
      value: OrderCursorValue<Def, Parent, Key>
    ): OrderCursorStartAt<Def, Parent, Key>

    startAfter<Parent, Key extends QueryFieldKey1<Parent> | DocId>(
      value: OrderCursorValue<Def, Parent, Key>
    ): OrderCursorStartAfter<Def, Parent, Key>

    endAt<Parent, Key extends QueryFieldKey1<Parent> | DocId>(
      value: OrderCursorValue<Def, Parent, Key>
    ): OrderCursorEndAt<Def, Parent, Key>

    endBefore<Parent, Key extends QueryFieldKey1<Parent> | DocId>(
      value: OrderCursorValue<Def, Parent, Key>
    ): OrderCursorEndBefore<Def, Parent, Key>

    docId(): DocId
  }

  /// Query utils

  //// QueryFieldKeyX

  export type QueryFieldKey1<Model> = Utils.UnionKeys<Utils.AllRequired<Model>>

  export type QueryFieldKey2<
    Model,
    Key1 extends QueryFieldKey1<Model>
  > = QueryFieldKey1<QueryFieldGet1<Model, Key1>>

  export type QueryFieldKey3<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>
  > = QueryFieldKey1<QueryFieldGet2<Model, Key1, Key2>>

  export type QueryFieldKey4<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>
  > = QueryFieldKey1<QueryFieldGet3<Model, Key1, Key2, Key3>>

  export type QueryFieldKey5<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>
  > = QueryFieldKey1<QueryFieldGet4<Model, Key1, Key2, Key3, Key4>>

  export type QueryFieldKey6<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
    Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>
  > = QueryFieldKey1<QueryFieldGet5<Model, Key1, Key2, Key3, Key4, Key5>>

  export type QueryFieldKey7<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
    Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
    Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>
  > = QueryFieldKey1<QueryFieldGet6<Model, Key1, Key2, Key3, Key4, Key5, Key6>>

  export type QueryFieldKey8<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
    Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
    Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>,
    Key7 extends QueryFieldKey7<Model, Key1, Key2, Key3, Key4, Key5, Key6>
  > = QueryFieldKey1<
    QueryFieldGet7<Model, Key1, Key2, Key3, Key4, Key5, Key6, Key7>
  >

  export type QueryFieldKey9<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
    Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
    Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>,
    Key7 extends QueryFieldKey7<Model, Key1, Key2, Key3, Key4, Key5, Key6>,
    Key8 extends QueryFieldKey8<Model, Key1, Key2, Key3, Key4, Key5, Key6, Key7>
  > = QueryFieldKey1<
    QueryFieldGet8<Model, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8>
  >

  export type QueryFieldKey10<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
    Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
    Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>,
    Key7 extends QueryFieldKey7<Model, Key1, Key2, Key3, Key4, Key5, Key6>,
    Key8 extends QueryFieldKey8<
      Model,
      Key1,
      Key2,
      Key3,
      Key4,
      Key5,
      Key6,
      Key7
    >,
    Key9 extends QueryFieldKey9<
      Model,
      Key1,
      Key2,
      Key3,
      Key4,
      Key5,
      Key6,
      Key7,
      Key8
    >
  > = QueryFieldKey1<
    QueryFieldGet9<Model, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8, Key9>
  >

  //// QueryFieldGetX

  export type QueryFieldGet1<
    Model,
    Key extends QueryFieldKey1<Model>
  > = Utils.UnionValue<Utils.AllRequired<Model>, Key>

  export type QueryFieldGet2<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>
  > = QueryFieldGet1<QueryFieldGet1<Model, Key1>, Key2>

  export type QueryFieldGet3<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>
  > = QueryFieldGet1<QueryFieldGet2<Model, Key1, Key2>, Key3>

  export type QueryFieldGet4<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>
  > = QueryFieldGet1<QueryFieldGet3<Model, Key1, Key2, Key3>, Key4>

  export type QueryFieldGet5<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
    Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>
  > = QueryFieldGet1<QueryFieldGet4<Model, Key1, Key2, Key3, Key4>, Key5>

  export type QueryFieldGet6<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
    Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
    Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>
  > = QueryFieldGet1<QueryFieldGet5<Model, Key1, Key2, Key3, Key4, Key5>, Key6>

  export type QueryFieldGet7<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
    Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
    Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>,
    Key7 extends QueryFieldKey7<Model, Key1, Key2, Key3, Key4, Key5, Key6>
  > = QueryFieldGet1<
    QueryFieldGet6<Model, Key1, Key2, Key3, Key4, Key5, Key6>,
    Key7
  >

  export type QueryFieldGet8<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
    Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
    Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>,
    Key7 extends QueryFieldKey7<Model, Key1, Key2, Key3, Key4, Key5, Key6>,
    Key8 extends QueryFieldKey8<Model, Key1, Key2, Key3, Key4, Key5, Key6, Key7>
  > = QueryFieldGet1<
    QueryFieldGet7<Model, Key1, Key2, Key3, Key4, Key5, Key6, Key7>,
    Key8
  >

  export type QueryFieldGet9<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
    Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
    Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>,
    Key7 extends QueryFieldKey7<Model, Key1, Key2, Key3, Key4, Key5, Key6>,
    Key8 extends QueryFieldKey8<
      Model,
      Key1,
      Key2,
      Key3,
      Key4,
      Key5,
      Key6,
      Key7
    >,
    Key9 extends QueryFieldKey9<
      Model,
      Key1,
      Key2,
      Key3,
      Key4,
      Key5,
      Key6,
      Key7,
      Key8
    >
  > = QueryFieldGet1<
    QueryFieldGet8<Model, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8>,
    Key9
  >

  export type QueryFieldGet10<
    Model,
    Key1 extends QueryFieldKey1<Model>,
    Key2 extends QueryFieldKey2<Model, Key1>,
    Key3 extends QueryFieldKey3<Model, Key1, Key2>,
    Key4 extends QueryFieldKey4<Model, Key1, Key2, Key3>,
    Key5 extends QueryFieldKey5<Model, Key1, Key2, Key3, Key4>,
    Key6 extends QueryFieldKey6<Model, Key1, Key2, Key3, Key4, Key5>,
    Key7 extends QueryFieldKey7<Model, Key1, Key2, Key3, Key4, Key5, Key6>,
    Key8 extends QueryFieldKey8<
      Model,
      Key1,
      Key2,
      Key3,
      Key4,
      Key5,
      Key6,
      Key7
    >,
    Key9 extends QueryFieldKey9<
      Model,
      Key1,
      Key2,
      Key3,
      Key4,
      Key5,
      Key6,
      Key7,
      Key8
    >,
    Key10 extends QueryFieldKey10<
      Model,
      Key1,
      Key2,
      Key3,
      Key4,
      Key5,
      Key6,
      Key7,
      Key8,
      Key9
    >
  > = QueryFieldGet1<
    QueryFieldGet9<Model, Key1, Key2, Key3, Key4, Key5, Key6, Key7, Key8, Key9>,
    Key10
  >
}