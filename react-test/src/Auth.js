export const isAutenticated = () => {
    if (localStorage.getItem("cargo") == null){
        return false
    } else {return true}
};