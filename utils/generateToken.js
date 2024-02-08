import { sign } from 'jsonwebtoken';

function generateAccessToken(username) {
    const secretKey = process.env.TOKEN_SECRET;
    const expiresIn = '1y';

    const token = sign({ username }, secretKey, { expiresIn });

    const decodedToken = decode(token);

    const expirationDate = new Date(decodedToken.exp * 1000); // UNIX zaman damgasını JavaScript tarihine dönüştür

    return {
        token,
        expirationDate
    };
}

export default generateAccessToken;