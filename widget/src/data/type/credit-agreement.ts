type ValueWithString = {
  value: number;
  string: string;
};

export type CreditAgreementsResponse = Array<{
  instalment_count: number;
  apr: ValueWithString;
  cost_of_credit: ValueWithString;
  grand_total: ValueWithString;
  instalment_amount: ValueWithString;
  instalment_fee: ValueWithString;
  instalment_total: ValueWithString;
  max_financed_amount: ValueWithString;
  total_with_tax: ValueWithString;
}>;

export type CreditAgreements = Array<{
  instalmentCount: number;
  apr: ValueWithString;
  costOfCredit: ValueWithString;
  grandTotal: ValueWithString;
  instalmentAmount: ValueWithString;
  instalmentFee: ValueWithString;
  instalmentTotal: ValueWithString;
  maxFinancedAmount: ValueWithString;
  totalWithTax: ValueWithString;
}>;
