    
    import CryptoJS from 'crypto-js';
    export function encrypt(message, key) {
    // Convertir la clave en un objeto WordArray
    var keyWordArray = CryptoJS.enc.Utf8.parse(key);
  
    // Encriptar el mensaje utilizando AES y la clave
    var encrypted = CryptoJS.AES.encrypt(message, keyWordArray, {
      mode: CryptoJS.mode.ECB, // Modo de encriptación
      padding: CryptoJS.pad.Pkcs7 // Relleno de datos
    });
  
    // Retornar el mensaje encriptado como una cadena Base64
    return encrypted.toString();
  }
  
  export function decrypt(encryptedMessage, key) {
    // Convertir la clave en un objeto WordArray
    var keyWordArray = CryptoJS.enc.Utf8.parse(key);
  
    // Descifrar el mensaje encriptado utilizando AES y la clave
    var decrypted = CryptoJS.AES.decrypt(encryptedMessage, keyWordArray, {
      mode: CryptoJS.mode.ECB, // Modo de encriptación
      padding: CryptoJS.pad.Pkcs7 // Relleno de datos
    });
  
    // Convertir el resultado descifrado en una cadena legible
    var decryptedMessage = CryptoJS.enc.Utf8.stringify(decrypted);
  
    // Retornar el mensaje desencriptado
    return decryptedMessage;
  }

  export function encryptAndDecrypt() {
    var message = document.getElementById('messageInput').value;
    var key = CryptoJS.enc.Utf8.parse('clave1234567890'); // La clave debe tener 16 caracteres (128 bits) // Reemplaza esto con tu propia clave
  
    var encryptedMessage = encrypt(message, key);
    var decryptedMessage = decrypt(encryptedMessage, key);
  
    console.log('Mensaje encriptado:', encryptedMessage);
    console.log('Mensaje desencriptado:', decryptedMessage);
  }