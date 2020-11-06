import type { SchemaqlFactory } from '@browserql/types'
import gql from 'graphql-tag'
import {
  DateResolver,
  TimeResolver,
  DateTimeResolver,
  // DurationResolver,
  UtcOffsetResolver,
  EmailAddressResolver,
  NegativeFloatResolver,
  NegativeIntResolver,
  NonEmptyStringResolver,
  NonNegativeFloatResolver,
  NonNegativeIntResolver,
  NonPositiveFloatResolver,
  NonPositiveIntResolver,
  PhoneNumberResolver,
  PositiveFloatResolver,
  PositiveIntResolver,
  PostalCodeResolver,
  UnsignedFloatResolver,
  UnsignedIntResolver,
  URLResolver,
  BigIntResolver,
  LongResolver,
  SafeIntResolver,
  UUIDResolver,
  GUIDResolver,
  HexColorCodeResolver,
  HSLResolver,
  HSLAResolver,
  IPv4Resolver,
  IPv6Resolver,
  ISBNResolver,
  MACResolver,
  PortResolver,
  RGBResolver,
  RGBAResolver,
  USCurrencyResolver,
  CurrencyResolver,
  JSONResolver,
  JSONObjectResolver,
  ObjectIDResolver,
  ByteResolver,
} from 'graphql-scalars'

export default function connectScalars(): SchemaqlFactory {
  return () => ({
    schema: gql`
      scalar Date

      scalar Time

      scalar DateTime

      # scalar Duration

      scalar UtcOffset

      scalar EmailAddress

      scalar NegativeFloat

      scalar NegativeInt

      scalar NonEmptyString

      scalar NonNegativeFloat

      scalar NonNegativeInt

      scalar NonPositiveFloat

      scalar NonPositiveInt

      scalar PhoneNumber

      scalar PositiveFloat

      scalar PositiveInt

      scalar PostalCode

      scalar UnsignedFloat

      scalar UnsignedInt

      scalar URL

      scalar ObjectID

      scalar BigInt

      scalar Long

      scalar SafeInt

      scalar UUID

      scalar GUID

      scalar HexColorCode

      scalar HSL

      scalar HSLA

      scalar IPv4

      scalar IPv6

      scalar ISBN

      scalar MAC

      scalar Port

      scalar RGB

      scalar RGBA

      scalar USCurrency

      scalar Currency

      scalar JSON

      scalar JSONObject

      scalar Byte

      scalar Void
    `,
    scalars: {
      ObjectID: ObjectIDResolver,

      Date: DateResolver,
      Time: TimeResolver,
      DateTime: DateTimeResolver,
      // Duration: DurationResolver,
      UtcOffset: UtcOffsetResolver,

      NonPositiveInt: NonPositiveIntResolver,
      PositiveInt: PositiveIntResolver,
      NonNegativeInt: NonNegativeIntResolver,
      NegativeInt: NegativeIntResolver,
      NonPositiveFloat: NonPositiveFloatResolver,
      PositiveFloat: PositiveFloatResolver,
      NonNegativeFloat: NonNegativeFloatResolver,
      NegativeFloat: NegativeFloatResolver,
      UnsignedFloat: UnsignedFloatResolver,
      UnsignedInt: UnsignedIntResolver,
      BigInt: BigIntResolver,
      Long: LongResolver,
      SafeInt: SafeIntResolver,

      EmailAddress: EmailAddressResolver,
      URL: URLResolver,
      PhoneNumber: PhoneNumberResolver,
      PostalCode: PostalCodeResolver,
      NonEmptyString: NonEmptyStringResolver,

      UUID: UUIDResolver,
      GUID: GUIDResolver,

      HexColorCode: HexColorCodeResolver,
      HSL: HSLResolver,
      HSLA: HSLAResolver,
      RGB: RGBResolver,
      RGBA: RGBAResolver,

      IPv4: IPv4Resolver,
      IPv6: IPv6Resolver,
      MAC: MACResolver,
      Port: PortResolver,

      ISBN: ISBNResolver,

      USCurrency: USCurrencyResolver,
      Currency: CurrencyResolver,
      JSON: JSONResolver,
      JSONObject: JSONObjectResolver,
      Byte: ByteResolver,
    },
  })
}
