import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';
import Nav from './components/Nav';
import Route from './route';

function ModuleA(props: any) {
    console.log(props);
    return <div>pppp</div>;
}
class A extends React.Component {
    constructor(props: any) {
        super(props);
    }
    render() {
        return <>hello</>;
    }
}

function Wrapper({children}: any) {
    console.log(children);
    return <>{children.type({key: children.key, ...children.props, hello: 'xx'})}</>;
}
ReactDOM.render(
    <React.StrictMode>
        <div style={{display: 'flex'}}>
            <Nav></Nav>
            <div style={{flex: 1}}>
                <Route />
            </div>
        </div>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
