export const fetchData = async (url) => {
    const response = await window.fetch(url);
    return response.json();
};
