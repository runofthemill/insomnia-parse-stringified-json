module.exports.responseHooks = [
  context => {
    var body = context.response.getBody();
    let data = JSON.parse(Buffer.from(body).toString());
    let maybeUnstringifiedData = data;

    const unstringifiedData = data => {
        let clonedData = { ...data };
        let entries = Object.entries(clonedData);

        entries.forEach(([key, value]) => {
          if (typeof value === 'object') {
            clonedData[key] = unstringifiedData(value)
          }
          if (typeof value === 'string') {
            try {
              clonedData[key] = JSON.parse(value);
            } catch (e) {
              clonedData[key] = value;
            }
          }
        })
      return clonedData;
    }

    if (typeof data === 'object') {
      maybeUnstringifiedData = unstringifiedData(data);
    }

    const formattedData = Buffer.from(JSON.stringify(maybeUnstringifiedData));
    context.response.setBody(formattedData);
  }
]
