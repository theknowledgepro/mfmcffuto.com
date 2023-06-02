export const isLoading = (key, loadingStore) => {
    return loadingStore.find(index => Object.keys(index)[0] === key);
}