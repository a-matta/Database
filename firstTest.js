'use strict';

const MariaDb = require('./database');

const options = {
    host: 'localhost',
    port: 3306,
    user: 'zeke',
    password: 'secret',
    database: 'employeedb',
    allowPublicKeyRetrieval: true //mysql users add this
};

const db=new MariaDb(options);

// db.doQuery('select * from employee').then(console.log).catch(console.log);

function printWorkers(employees){
    for(let person of employees){
        console.log(`${person.employeeId}: ${person.firstname} ${person.lastname}`+
        ` Dept: ${person.department}, ${person.salary} €`);
    }
}
async function getAll(){
    try{
        const result=await db.doQuery('select * from employee');
        if(result.resultSet){
            printWorkers(result.queryResult);
        }
    }
    catch(error){
        console.log(error);
    }
}

async function get(id){
    try{
        const result = await db.doQuery('select * from employee where employeeId=?',[id]);
        printWorkers(result.queryResult);
    }
    catch(error){
        console.log(error);
    }
}

async function add(person){
    try{
        const parameters=[
            person.employeeId,
            person.firstname,
            person.lastname,
            person.department,
            person.salary
        ];
        // const parameters = Object.values(person);
        const sql='insert into employee values(?,?,?,?,?)';
        const status=await db.doQuery(sql,parameters);
        console.log('Status',status);
    }
    catch(error){
        console.log(error);
    }
}
async function add2(person) {
    try {
        const parameters = [
            person.lastname,
            person.firstname,
            person.department,
            person.salary,
            person.employeeId
        ];
       
        const sql = 'insert into employee (lastname,firstname,department,salary,employeeId) '+
                    'values(?,?,?,?,?)';
        const status = await db.doQuery(sql, parameters);
        console.log('Status', status);
    }
    catch (error) {
        console.log(error);
    }
}

async function remove(id){
    try{
        const sql='delete from employee where employeeId=?';
        const status = await db.doQuery(sql, [id]);
        console.log('removal status',status);
    }
    catch(error){
        console.log(error);
    }
}

async function update(person){
    try{
        const sql=  'update employee set firstname=?, lastname=?, department=?, salary=? '+
                    'where employeeId=?'
        const parameters = [
            person.firstname,
            person.lastname,
            person.department,
            person.salary,
            person.employeeId
        ];
    
        const status = await db.doQuery(sql, parameters);
        console.log('update status: rowsChanged=', status.queryResult.rowsChanged);
        
    }
    catch(error){
        console.log(error);
    }
}

async function update2(person) {
    try {
        const sql = 'update employee set firstname=?, lastname=?, department=?, salary=? ' +
            'where employeeId=?'
        const parameters = [
            person.firstname,
            person.lastname,
            person.department,
            person.salary,
            person.employeeId
        ];
        const result = await db.doQuery('select employeeId from employee where employeeId=?',
            [person.employeeId]);
        if (result.queryResult.length === 0) {
            console.log(`nothing to update with Id=${person.employeeId}`);
        }
        else {
            const status = await db.doQuery(sql, parameters);
            console.log('update status: rowsChanged=', status.queryResult.rowsChanged);
        }
    }
    catch (error) {
        console.log(error);
    }
}


async function run(){
    console.log('####### getAll #######')
    await getAll();
    console.log('##### get 1 ######');
    await get(1);
    console.log('##### get 2 #####');
    await get(2);
    console.log('##### remove 500 #####');
    await remove(500);
    console.log('###### add 500 ######');
    const newEmp={
        employeeId:500,
        firstname:'Paul',
        lastname:'Jones',
        department:'maintenance',
        salary:5000
    };
    await add2(newEmp);
    console.log('####### remove 200,300 and 400 ###');
    await remove(200);
    await remove(300);
    await remove(400);
    await getAll();
    const updatedEmp={
        employeeId:5,
        firstname:'Billx',
        lastname:'Bondx',
        department:'secrx',
        salary:1000
    };
    await update(updatedEmp);
    await getAll();
    await update2({
        employeeId: 125,
        firstname: 'B',
        lastname: 'Bond',
        department: 'se',
        salary: 2000
    });
    await getAll();
}

run();