import {createApp} from 'mantra-core';
import initContext from './configs/context';
import setupPage from './configs/page-setup';

// modules
import appModule from './modules/app';
import coreModule from './modules/core';
import themeModule from './modules/theme';

setupPage();

// init context
const context = initContext();

// create app
const app = createApp(context);
app.loadModule(appModule);
app.loadModule(coreModule);
app.loadModule(themeModule);


app.init();
