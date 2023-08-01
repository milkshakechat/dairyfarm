import { CurrencyEnum } from "@milkshakechat/helpers";
import { getExchangeRateAPISecret } from "../utils/secrets";
import axios from "axios";

export const getFxRates = async ({
  from,
  to,
}: {
  from: CurrencyEnum;
  to: CurrencyEnum;
}) => {
  try {
    const token = await getExchangeRateAPISecret();
    const response = await axios.get(
      "https://api.exchangeratesapi.io/v1/latest",
      {
        params: {
          access_key: token,
          from,
          to,
          base: CurrencyEnum.USD,
        },
      }
    );
    return {
      fromCurr: from,
      fromRate: parseFloat(response.data.rates[from]),
      toCurr: to,
      toRate: parseFloat(response.data.rates[to]),
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const changeFxBase = async ({
  base = CurrencyEnum.USD,
}: {
  base?: CurrencyEnum;
}) => {
  try {
    const token = await getExchangeRateAPISecret();
    const response = await axios.get(
      "https://api.exchangeratesapi.io/v1/latest",
      {
        params: {
          access_key: token,
          base: CurrencyEnum.USD,
        },
      }
    );
    console.log(`response.data`, response.data);
  } catch (e: any) {
    console.log(e.response.data);
    // throw e;
  }
};
