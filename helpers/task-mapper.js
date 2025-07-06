const taskMapperToJson = (tasks) => {
  return tasks.map((task) => {
    /* eslint-disable no-unused-vars */
    const { userId, __v, token, ...data } = task.toJSON();
    return data;
  });
};

module.exports = {
  taskMapperToJson,
};
