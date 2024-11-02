export type UserData = {
    name: string;
    email: string;
    password: string;
}

export type User = UserData &{
    _id: string;
    role: string;
}
