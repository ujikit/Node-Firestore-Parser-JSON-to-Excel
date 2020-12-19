const fs = require('fs');
const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Worksheet Name');

let json_target_file = 'data.json';

_phoneNumberFormater = (phone_number) => {
  console.log(phone_number);
  if (phone_number && typeof phone_number == 'string') {
    let splited_phone_number = phone_number.split("");
    if (splited_phone_number[0] == '0') {
      const index = splited_phone_number.indexOf(splited_phone_number[0]);
      if (index > -1) {
        splited_phone_number.splice(index, 1);
        return `${0}${splited_phone_number.join("")}`
      }
    }
    else if (splited_phone_number[0] == '+') {
      const index = splited_phone_number.indexOf(splited_phone_number[0]);
      if (index > -1) {
        splited_phone_number.splice(index, 3);
        return `${0}${splited_phone_number.join("")}`
      }
    }
    else {
      return `${0}${splited_phone_number.join("")}`
    }
  }
  else {
    return ''
  }
}

fs.readFile(json_target_file, (err, data) => {
  if (err) return callback(err)
  let aa = JSON.parse(data);

  let new_data = []

  for (var i = 0; i < Object.keys(aa.users).length; i++) {
    let object_key = aa['users'][Object.keys(aa.users)[i]];
    new_data.push({
      name: `${object_key.first_name}${object_key.last_name ? ` ${object_key.last_name}` : ''}`,
      phone: `${object_key.phone ? _phoneNumberFormater(object_key.phone) : ''}`
    })
  }
  console.log(new_data);

  const headingColumnNames = [
    "Full Name",
    "Phone",
  ]

  //Write Column Title in Excel file
  let headingColumnIndex = 1;
  headingColumnNames.forEach(heading => {
      ws.cell(1, headingColumnIndex++)
          .string(heading)
  });

  //Write Data in Excel file
  let rowIndex = 2;
  new_data.forEach( record => {
    let columnIndex = 1;
    Object.keys(record ).forEach(columnName =>{
      ws.cell(rowIndex,columnIndex++)
        .string(record [columnName])
    });
    rowIndex++;
  });
  wb.write('data.xlsx');

})
