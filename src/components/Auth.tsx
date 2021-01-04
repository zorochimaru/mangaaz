import { GoogleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { BSON } from 'mongodb-stitch-browser-sdk';
import React, { CSSProperties, useContext } from 'react'
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import { getDB } from '../config/db';
import { UserContext } from '../HOC/AuthContext';
import { User, Roles } from '../models/User.model';
import { GOOGLE_OAUTH2 } from '../types/constants';


const Auth: React.FC<any> = () => {
    const { user, setUser } = useContext(UserContext);
    function loginHandler(data: any) {
        const newUser: User = {
            googleId: data?.googleId,
            name: data?.profileObj.name,
            img: data?.profileObj.imageUrl,
            email: data?.profileObj.email,
            tokenObj: data?.tokenObj,
        };
        getDB('auth').collection('users').findOneAndUpdate({ googleId: data?.googleId }, { $set: { ...newUser } })
            .then((user: any) => {
                console.log('find and update user', user);
                if (user) {
                    setUser(user);
                } else {
                    getDB('auth').collection('users').insertOne({role: Roles.READER, ...newUser}).then((result) => {
                        getDB('auth').collection('users').findOne({ _id: new BSON.ObjectId(result.insertedId) }).then((user: any) => {
                            console.log('new user crated', user);
                            setUser(user);
                        }).catch(e => Error(e));
                    });
                }
            });
    }

    function logoutHandler() {
        setUser(null);
    }

    const expiryDate = new Date(new Date().getTime() + user?.tokenObj?.expires_in * 1000);

    return (
        expiryDate > new Date() ? <GoogleLogout
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
