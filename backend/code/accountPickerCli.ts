import * as figlet from 'figlet';
import * as fs from 'fs';
import * as readline from 'node:readline';
(async () => {
  const header = figlet.textSync('Account Picker', {
    font: 'Roman',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  });

  console.log(header);

  const users = fs
    .readFileSync('./users.txt', 'utf8')
    .trim()
    .split('\n')
    .map((user) => {
      const [email, password] = user.split(':');
      return { email, password };
    });

  // list users to choose from
  const userChoices = users.map((user, index) => {
    return {
      name: `${user.email} (${user.password})`,
      value: index,
    };
  });

  // list uset userChoices
  //
  for (const userChoice of userChoices) {
    console.log(`${userChoice.value}: ${userChoice.name}`);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query: string) =>
    new Promise<string>((resolve) =>
      rl.question(query, (ans) => {
        resolve(ans);
      }),
    );

  const userIndex = await question('User index: ');
  const user = users[parseInt(userIndex as string, 10)];
  console.log(`You chose: ${user.email} (${user.password})`);
  rl.close();

  const codeTemplate = `
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "email": "${user.email}",
  "password": "${user.password}"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:3001/auth/login", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));`;
  console.log(codeTemplate);
})();
