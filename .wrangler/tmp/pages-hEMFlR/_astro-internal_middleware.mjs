globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_v4DeogX3.mjs';
import './chunks/astro/server_k4Nw9Nby.mjs';
import { s as sequence } from './chunks/index_C7X7_Q-u.mjs';

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	
	
);

export { onRequest };
