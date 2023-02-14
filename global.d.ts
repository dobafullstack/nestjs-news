declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: string;
			MONGODB_URL: string;
			SECRET_JWT: string;
		}
	}
}

export {};
