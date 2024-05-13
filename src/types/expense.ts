export interface IExpense {
	_id: string;
	title: string;
	amount: number;
	categories: string[];
	createdAt: number;
}

export interface ICategory {
	id: string;
	txt: string;
	imgUrl: string;
}
export interface IExpenseFilter {
	title: string;
	minAmount: number;
	maxAmount: number;
	categories: ICategory[];
}
