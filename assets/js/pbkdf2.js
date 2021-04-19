async function encrypt(input, passwd) {
	const enc = new TextEncoder();
	const encodedInput = enc.encode(input);
	const salt = window.crypto.getRandomValues(new Uint8Array(16));
	const iv = window.crypto.getRandomValues(new Uint8Array(12));
	const key = await getKey(enc.encode(passwd), salt);
	const ciphertext = await window.crypto.subtle.encrypt({
		name: "AES-GCM",
		iv: iv
	}, key, encodedInput);

	return {
		output: hexString(new Uint8Array(ciphertext)),
		salt: hexString(salt),
		iv: hexString(iv)
	};
}

async function decrypt(hexInput, passwd, hexSalt, hexIv) {
	const enc = new TextEncoder();
	const salt = new Uint8Array(byteArray(hexSalt));
	const iv = new Uint8Array(byteArray(hexIv));
	const key = await getKey(enc.encode(passwd), salt);
	const ciphertext = new Uint8Array(byteArray(hexInput));

	try {
		let decrypted = await window.crypto.subtle.decrypt({
			name: "AES-GCM",
			iv: iv
		}, key, ciphertext);
		let dec = new TextDecoder();

		return {
			output: dec.decode(decrypted)
		}
	} catch (e) {
		return {
			error: e
		}
	}
}

async function getKey(encodedPasswd, salt) {
	const keyMaterial = await window.crypto.subtle.importKey("raw", encodedPasswd, {
		name: "PBKDF2"
	}, false, ["deriveBits", "deriveKey"]);
	return window.crypto.subtle.deriveKey({
		"name": "PBKDF2",
		salt: salt,
		"iterations": 100000,
		"hash": "SHA-256"
	}, keyMaterial, {
		"name": "AES-GCM",
		"length": 256
	}, true, ["encrypt", "decrypt"]);
}

function getDecryptUrl(encrypted) {
	const currentPath = window.location.pathname;
	const decryptPath = currentPath.substring(0, currentPath.lastIndexOf("/")) + '/decrypt.html?i=' + encrypted.output + '&s=' + encrypted.salt + '&iv=' + encrypted.iv;
	return window.location.protocol + '//' + window.location.hostname + decryptPath;
}