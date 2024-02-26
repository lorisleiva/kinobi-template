import { appendTransactionInstruction, pipe } from '@solana/web3.js';
import test from 'ava';
import { Counter, fetchCounter, getCreateInstruction } from '../src';
import {
  createDefaultSolanaClient,
  createDefaultTransaction,
  generateKeyPairSignerWithSol,
  signAndSendTransaction,
} from './_setup';

test('it creates a new counter account', async (t) => {
  // Given
  const client = createDefaultSolanaClient();
  const authority = await generateKeyPairSignerWithSol(client);

  // When
  const createIx = getCreateInstruction({ authority, payer: authority });
  await pipe(
    await createDefaultTransaction(client, authority),
    (tx) => appendTransactionInstruction(createIx, tx),
    (tx) => signAndSendTransaction(client, tx)
  );

  // Then
  const counter = await fetchCounter(client.rpc, authority.address);
  t.like(counter, <Counter>{
    data: {
      authority: authority.address,
      value: 0,
    },
  });
});
