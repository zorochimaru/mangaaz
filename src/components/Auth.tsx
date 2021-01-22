import { GoogleOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { CSSProperties, useContext, useEffect } from 'react'
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import { getDB, RealmApp } from '../config/db';
import { UserContext } from '../HOC/AuthContext';
import { User, Roles } from '../models/User.model';
import { GOOGLE_OAUTH2 } from '../types/constants';
import * as Realm from "realm-web";
import { BSON } from 'realm-web';


const Auth: React.FC<any> = () => {
    const { user, setUser } = useContext(UserContext);
    const expiryDate = new Date(new Date().getTime() + user?.tokenObj?.expires_in * 1000);

    useEffect(() => {

        if (RealmApp.currentUser?.isLoggedIn) {
            // The user is logged in. Add their user object to component state.
            setUser(RealmApp.currentUser.customData);
        } else {
            // Login as Anonim
            const credentials = Realm.Credentials.anonymous();
            RealmApp.logIn(credentials).then((user) => setUser(user));
        }

    }, [setUser,])


    function loginHandler(data: any) {
        const hide = message.loading('Login in progress..', 0);
        const credentials = Realm.Credentials.google({ idToken: data.tokenId });
        RealmApp.logIn(credentials).then((res) => {
            const newUser: User = {
                id: res.id,
                role: res.customData?.role ? res.customData?.role : Roles.READER,
                name: data?.profileObj?.name,
                img: data?.profileObj?.imageUrl,
                email: data?.profileObj?.email,
                tokenObj: data?.tokenObj,
            };

            getDB('auth')?.collection('users').findOneAndUpdate({ id: res.id }, { $set: { ...newUser } })
                .then((user: any) => {
                    if (user) {
                        setUser(user);
                    } else {
                        getDB('auth')?.collection('users').insertOne(newUser).then((result) => {
                            getDB('auth')?.collection('users').findOne({ _id: new BSON.ObjectId(result.insertedId) }).then((user: any) => {
                                setUser(user);
                            }).catch(e => Error(e));
                        });
                    }
                }).finally(() => setTimeout(hide, 0));
        });
    }

    function logoutHandler() {
        setUser(null);
        RealmApp.currentUser?.logOut();
    }


    return (
        RealmApp.currentUser?.isLoggedIn && expiryDate > new Date()
            ? <GoogleLogout
                clientId={GOOGLE_OAUTH2}
                buttonText="Logout"
                onLogoutSuccess={logoutHandler}
                render={renderProps => (
                    <Button icon={<GoogleOutlined />} style={styles.login} onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</Button>
                )}
            />
            : <GoogleLogin
                clientId={GOOGLE_OAUTH2}
                render={renderProps => (
                    <Button icon={<GoogleOutlined />} style={styles.login} onClick={renderProps.onClick} disabled={renderProps.disabled}>Login</Button>
                )}
                onSuccess={(data) => loginHandler(data)}
                onFailure={logoutHandler}
                isSignedIn={true}
            />
    )
}
const styles: { [key: string]: CSSProperties } = {
    login: {
        position: 'absolute',
        right: 20,
    }
}
export default Auth
