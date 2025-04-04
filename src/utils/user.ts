
export const setUserToLocal = (user:string) => {
    localStorage.setItem("loggedinuser",user);
}

export const getUserFromLocal = () :string=> {
    return localStorage.getItem("loggedinuser")||"";
}