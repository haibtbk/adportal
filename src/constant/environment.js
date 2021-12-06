import _ from 'lodash';

const Env = {
  test: 'test',
  pro: 'pro',
};

Env.all = _.transform(Env, function(result, value, key) {
  result.push(value);
}, []);

export default Env;