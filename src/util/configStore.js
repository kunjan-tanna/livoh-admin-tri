import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
// createStore: Creates a Redux store that holds the complete state tree of your app.
// applyMiddleware : Middleware lets you wrap the store's dispatch method.
// combineReducers : to create a single root reducer out of many.
// Redux Thunk middleware allows you to write action creators that return a function instead of an action.

export default function configureStore(initialState) {

    const store = createStore(
        reducers,
        initialState,
        compose(applyMiddleware(thunk))
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/index', () => {
            const nextRootReducer = require('../reducers/index');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}