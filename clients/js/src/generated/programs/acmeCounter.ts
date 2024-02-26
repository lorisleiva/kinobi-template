/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Address } from '@solana/addresses';
import { getU8Encoder } from '@solana/codecs-numbers';
import { Program, ProgramWithErrors } from '@solana/programs';
import {
  AcmeCounterProgramError,
  AcmeCounterProgramErrorCode,
  getAcmeCounterProgramErrorFromCode,
} from '../errors';
import { memcmp } from '../shared';
import { Key, getKeyEncoder } from '../types';

export const ACME_COUNTER_PROGRAM_ADDRESS =
  'MyProgram1111111111111111111111111111111111' as Address<'MyProgram1111111111111111111111111111111111'>;

export type AcmeCounterProgram =
  Program<'MyProgram1111111111111111111111111111111111'> &
    ProgramWithErrors<AcmeCounterProgramErrorCode, AcmeCounterProgramError>;

export function getAcmeCounterProgram(): AcmeCounterProgram {
  return {
    name: 'acmeCounter',
    address: ACME_COUNTER_PROGRAM_ADDRESS,
    getErrorFromCode(code: AcmeCounterProgramErrorCode, cause?: Error) {
      return getAcmeCounterProgramErrorFromCode(code, cause);
    },
  };
}

export enum AcmeCounterAccount {
  Counter,
}

export function identifyAcmeCounterAccount(
  account: { data: Uint8Array } | Uint8Array
): AcmeCounterAccount {
  const data = account instanceof Uint8Array ? account : account.data;
  if (memcmp(data, getKeyEncoder().encode(Key.Counter), 0)) {
    return AcmeCounterAccount.Counter;
  }
  throw new Error(
    'The provided account could not be identified as a acmeCounter account.'
  );
}

export enum AcmeCounterInstruction {
  Create,
}

export function identifyAcmeCounterInstruction(
  instruction: { data: Uint8Array } | Uint8Array
): AcmeCounterInstruction {
  const data =
    instruction instanceof Uint8Array ? instruction : instruction.data;
  if (memcmp(data, getU8Encoder().encode(0), 0)) {
    return AcmeCounterInstruction.Create;
  }
  throw new Error(
    'The provided instruction could not be identified as a acmeCounter instruction.'
  );
}
