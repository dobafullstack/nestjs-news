
/**
 * Generate a number string with 6 characters
 * @example
 * `000000`
 */
export const generateString = () => {
	var result = '';
    
	var characters =
		'0123456789';

	var charactersLength = characters.length;

	for (var i = 0; i < 6; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
};
