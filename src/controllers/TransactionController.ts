import { BlsTransaction, createAccount } from 'ethdk';
import { getNetwork } from '../constants';
import { useLocalStore } from '../store';

export type SendTransactionParams = {
  to: string,
  from?: string,
  gas?: string,
  gasPrice?: string,
  value?: string,
  data?: string,
};

function findNetwork() {
  const { network } = useLocalStore.getState();
  return getNetwork(network);
}

export const sendTransaction = async (
  params: SendTransactionParams[],
) => {
  const account = await createAccount({
    accountType: 'bls',
    privateKey: useLocalStore.getState().privateKey,
  });

  const transaction = await account.sendTransaction({
    to: params[0].to,
    value: params[0].value,
  });

  return transaction.hash;
};

export const getTransactionReceipt = async (hash: string) => {
  const transaction = new BlsTransaction({
    bundleHash: hash,
    network: findNetwork().name,
  });
  const receipt = await transaction.getTransactionReceipt();
  return receipt;
};

export const getAddress = async () => {
  const account = await createAccount({
    accountType: 'bls',
    privateKey: useLocalStore.getState().privateKey,
  });
  return account.address;
};

export const createRecoveryHash = async (recoveryAddress: string, salt: string) => {
  const account = await createAccount({
    accountType: 'bls',
    privateKey: useLocalStore.getState().privateKey,
  });
  const transaction = await account.setTrustedAccount(
    salt,
    recoveryAddress,
  );
  return transaction.hash;
};
