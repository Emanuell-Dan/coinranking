const convertToDateString = value => {
	if (!value) {
    return '';
	}
	
	value = new Date(Number(value));
  return value.toDateString();
};

exports.default = convertToDateString;
