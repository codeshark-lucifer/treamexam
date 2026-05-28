const BAD_WORDS = [
    "badword1",
    "badword2",
    "offensive1",
    // Add more common bad words here
];

export function censorText(text: string): string {
    if (!text) return text;
    
    let censored = text;
    BAD_WORDS.forEach(word => {
        const regex = new RegExp(word, "gi");
        censored = censored.replace(regex, "*".repeat(word.length));
    });
    
    return censored;
}
