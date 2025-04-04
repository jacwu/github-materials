/**
 */
class Car {
    // properties
    public brand: string;
    public year: number;
    public model: string;

    // constructor
    constructor(brand: string, year: number, model: string) {
        this.brand = brand;
        this.year = year;
        this.model = model;
    }

    // getter and setter
    public getName(): string {
        return this.brand;
    }

    public setName(brand: string): void {
        this.brand = brand ;
    }

    public getYear(): number {
        return this.year;
    }

    public setYear(year: number): void {
        this.year = year;
    }

    public getModel(): string {
        return this.model;
    }

    public setModel(model: string): void {
        this.model = model;
    }
    
    public getCarInfo(): string {
        return `${this.brand} ${this.model} ${this.year} `;
    }
}