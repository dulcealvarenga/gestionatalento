export const loadFonts = () => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
};