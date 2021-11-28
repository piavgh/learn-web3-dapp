import type {NextApiRequest, NextApiResponse} from 'next';
import {configFromNetwork} from '@figment-near/lib';
import {connect} from 'near-api-js';

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const {NETWORK, ACCOUNT_ID} = req.body;
    const config = configFromNetwork(NETWORK);
    const client = await connect(config);
    const account = await client.account(ACCOUNT_ID);
    const balance = await account.getAccountBalance();
    return res.status(200).json(balance.available);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    return res.status(500).json(errorMessage);
  }
}
