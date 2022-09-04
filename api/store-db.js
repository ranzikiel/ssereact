const {Datastore} = require('@google-cloud/datastore');
const ds = new Datastore({ namespace: 'NodeApiExpress' });

const kind = 'datastore';

function keyConversion(id) {//return the id of a specific name
  return ds.key([kind, id]);
}

module.exports.exportDatastore = async (name) => { //return a list of a key and obj(Name,number). it search for a specifique name in the database
  let [data] = await ds.createQuery(kind).filter('__key__','=',keyConversion(name)).order('name').run();
  return data;
};

module.exports.put = async (obj) => { //Save a given object
  const entity = {
    key: keyConversion(obj.name),
    data: obj,
  }
  await ds.save(entity);
};

module.exports.delete = async (name) => {//Delete a given object
  await ds.delete(keyConversion(name));
};