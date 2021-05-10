export interface Rent {
	id: bigint;
	price: number;

	pickUpDate: Date;
	dropOffDate: Date;

	clientId: bigint;
	carId: bigint;
	companyId: bigint;
}
