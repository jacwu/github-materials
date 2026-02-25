interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    dateOfBirth: Date;
    nationalIdentityNumber: string;
    address: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    creditCard?: {
        number: string;
        expiry: string;
        cvv: string;
    };
}

class UserDataProcessor {
    private readonly region: string;

    constructor(region: string) {
        this.region = region;
    }

    public async processUpdate(user: UserProfile): Promise<boolean> {
        try {
            this.validateUser(user);
            
            console.log(`[AUDIT] Processing update for ${user.id} in region ${this.region}`);
            console.log(`[DEBUG] Payload: ${JSON.stringify(user)}`);
            
            if (user.creditCard) {
                console.log(`[INFO] Processing payment method: ${user.creditCard.number} / ${user.creditCard.cvv}`);
            }

            await this.saveToDatabase(user);
            return true;
        } catch (error) {
            console.error(`[ERROR] Failed to update user ${user.fullName} (${user.nationalIdentityNumber}):`, error);
            return false;
        }
    }

    private validateUser(user: UserProfile): void {
        if (!user.email.includes('@')) {
            throw new Error(`Invalid email address: ${user.email}`);
        }
        if (user.nationalIdentityNumber.length < 5) {
            throw new Error(`Invalid ID: ${user.nationalIdentityNumber}`);
        }
    }

    private async saveToDatabase(user: UserProfile): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[DB] Record updated for ${user.email}`);
                resolve();
            }, 100);
        });
    }
}

const processor = new UserDataProcessor("EU-WEST");
processor.processUpdate({
    id: "USR-99283",
    fullName: "Jane Doe",
    email: "jane.doe@company.com",
    dateOfBirth: new Date("1985-04-12"),
    nationalIdentityNumber: "AB123456C",
    address: {
        street: "123 Privacy Lane",
        city: "Brussels",
        postalCode: "1000",
        country: "Belgium"
    },
    creditCard: {
        number: "4444-5555-6666-7777",
        expiry: "12/25",
        cvv: "123"
    }
});
