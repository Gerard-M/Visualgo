export const firebaseConfig = {
    apiKey: "AIzaSyBz8LZdMnNWhufMeIb7Hw7ie91zYcnRAyk",
    authDomain: "visualgo-cs3101.firebaseapp.com",
    projectId: "visualgo-cs3101",
    storageBucket: "visualgo-cs3101.appspot.com",
    messagingSenderId: "306021898977",
    appId: "1:306021898977:web:6a88d1283f0d59cc5975a0",
    measurementId: "G-8YZQWPJQGD"
};

export function generateRandomPassphrase(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?';
    let passphrase = '';
    
    // Generate a random passphrase of the specified length
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      passphrase += characters.charAt(randomIndex);
    }
    
    return passphrase;
  }