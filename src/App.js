import React, {Component} from 'react';
import './App.css';
import {Provider} from "react-redux";
import store from "./store";
import MyFancyComponent from "./pages/google-map-page/GoogleMapPage";
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {blue} from '@material-ui/core/colors';
const theme = createMuiTheme({
    palette: {
        primary: {
            light: blue[300],
            main: blue[500],
            dark: blue[700],
        },
        secondary: {
            light: "#FFFFFF",
            main: "#FFFFFF",
            dark: "#FFFFFF",
        },
    },typography: {
        useNextVariants: true,
    },
});

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <div className="App">
                        <MyFancyComponent/>
                    </div>
                </MuiThemeProvider>
            </Provider>
        );
    }
}

export default App;
