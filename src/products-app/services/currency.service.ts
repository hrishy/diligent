import { Currency } from './../enums/currency-enum';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class CurrencyService {
  constructor(private readonly configService: ConfigService) {}

  getApiKey(): string {
    return this.configService.get<string>('apiKey');
  }

  async getConversionRate(
    fromCurrency: Currency,
    toCurrency: Currency,
  ): Promise<number> {
    const API_KEY = this.getApiKey();
    const url = `http://apilayer.net/api/live?access_key=${API_KEY}&currencies=${toCurrency}&source=${fromCurrency}&format=1`;
    const response = await axios.get(url);
    const { success, quotes } = response.data;

    if (!success) {
      throw new Error('Failed to retrieve exchange rate');
    }

    const exchangeRate = quotes[`${fromCurrency}${toCurrency}`];
    return exchangeRate;
  }
}
