
export interface Bond {
  id: string;
  name: string;
  issuer: string;
  type: "Treasury" | "Corporate" | "Municipal";
  rating: string;
  yield: number;
  maturityDate: string;
  price: number;
  couponRate: number;
  minimumInvestment: number;
  status: "Active" | "Inactive" | "Pending";
  risk: "Low" | "Medium" | "High";
  term: string;
  description: string;
}

export const mockBonds: Bond[] = [
  {
    id: "b1",
    name: "U.S. Treasury Bond 2028",
    issuer: "U.S. Department of the Treasury",
    type: "Treasury",
    rating: "AAA",
    yield: 3.25,
    maturityDate: "2028-06-15",
    price: 98.75,
    couponRate: 3.0,
    minimumInvestment: 1000,
    status: "Active",
    risk: "Low",
    term: "5 Year",
    description: "A U.S. Treasury bond with a 5-year term, offering a steady return backed by the full faith and credit of the United States government."
  },
  {
    id: "b2",
    name: "Apple Inc. Corporate Bond",
    issuer: "Apple Inc.",
    type: "Corporate",
    rating: "AA+",
    yield: 4.1,
    maturityDate: "2029-09-22",
    price: 101.25,
    couponRate: 4.0,
    minimumInvestment: 5000,
    status: "Active",
    risk: "Low",
    term: "7 Year",
    description: "A corporate bond issued by Apple Inc., offering a stable return from one of the world's most valuable technology companies."
  },
  {
    id: "b3",
    name: "NYC Municipal Bond 2030",
    issuer: "New York City",
    type: "Municipal",
    rating: "A+",
    yield: 3.8,
    maturityDate: "2030-12-01",
    price: 99.5,
    couponRate: 3.7,
    minimumInvestment: 2500,
    status: "Active",
    risk: "Medium",
    term: "8 Year",
    description: "A municipal bond issued by New York City to fund local infrastructure projects. May offer tax advantages for certain investors."
  },
  {
    id: "b4",
    name: "Microsoft Corporate Bond",
    issuer: "Microsoft Corporation",
    type: "Corporate",
    rating: "AAA",
    yield: 3.9,
    maturityDate: "2031-04-15",
    price: 102.5,
    couponRate: 3.75,
    minimumInvestment: 5000,
    status: "Active",
    risk: "Low",
    term: "9 Year",
    description: "A corporate bond issued by Microsoft Corporation, offering reliable returns from a leading technology company with a strong balance sheet."
  },
  {
    id: "b5",
    name: "California State Bond 2028",
    issuer: "State of California",
    type: "Municipal",
    rating: "AA-",
    yield: 3.6,
    maturityDate: "2028-08-10",
    price: 98.25,
    couponRate: 3.5,
    minimumInvestment: 3000,
    status: "Active",
    risk: "Medium",
    term: "5 Year",
    description: "A municipal bond issued by the State of California to fund state projects and initiatives. May offer tax advantages for California residents."
  },
  {
    id: "b6",
    name: "Amazon Corporate Bond",
    issuer: "Amazon.com Inc.",
    type: "Corporate",
    rating: "AA",
    yield: 4.2,
    maturityDate: "2032-11-30",
    price: 100.75,
    couponRate: 4.1,
    minimumInvestment: 5000,
    status: "Active",
    risk: "Medium",
    term: "10 Year",
    description: "A corporate bond issued by Amazon, offering a competitive yield from one of the world's largest e-commerce and cloud computing companies."
  }
];

export type TradeAction = "Buy" | "Sell";

export interface TradeDetails {
  bond: Bond;
  quantity: number;
  action: TradeAction;
  totalAmount: number;
}
