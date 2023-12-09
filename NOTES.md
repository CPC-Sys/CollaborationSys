these videos helped with defining the async/await functionality for routes/controllers files
Video Title: MySQL, Node.js Express
https://www.youtube.com/watch?v=Hej48pi_lOc
Video Title: Node.js + MySQL CRUD - GET, POST, PUT and DELETE channel: codeaffection
https://www.youtube.com/watch?v=YkBOkV0s5eQ

thunderclient entry for POST -> USERS
{
"usr_name":"Julio Berrios",
"usr_email":"padrinoa@gmail.com",
"usr_password":"Psdkfj44",
"usr_role": 1,
"usr_dt_created":"2023/6/29",
"usr_img": null,
"usr_createdby": "Milton",
"usr_status":"active",
"usr_refresh_token": null
}

the body-parser package convert the Post body into json format

chatGPT Prompt:
I have three tables in a MySQL database. The first table is the Notes table. The second table is the Projects table. The third table is the Users table. The Notes table has 5 fields: nte_id, nte_prj_id, nte_note, nte_usr_id, and nte_date. The primary Key for the Notes table is the nte_id. The Notes Table has two foreign keys. The first foreign key is nte_prj_id. This foreign key relates to the Projects Table field prj_id. The second foreign key is nte_usr_id. This foreign key relates to the Users Table field usr_id. The users table has 6 fields: user_id, user_full_name, user_email, user_password, user_role and user_status. The primary Key for the users table is the user_id. The projects table has 10 fields: proj_id, proj_num, proj_ref_num, proj_title, proj_status, proj_priority, proj_description, proj_notes, user, proj_due_date. The primary key is proj_id and user is the user from the users table. When a user submits a new project data, I need to create a record in the Projects table and a record in the Notes table. The field prj_notes in the Projects table keeps a count of how many notes exists for the project. Can you write an INSERT command to create the new record in each table?

CREATE DATABASE cpc_proj_mgr;

CREATE TABLE IF NOT EXISTS tb_users (
usr_id INT AUTO_INCREMENT PRIMARY KEY,
usr_name VARCHAR(50) NOT NULL,
usr_email VARCHAR(64) NOT NULL,
usr_password VARCHAR(64) NOT NULL,
usr_role TINYINT NOT NULL,
usr_dt_created DATE DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d')),
usr_status TINYINT NOT NULL,
usr_createdby VARCHAR(50) NOT NULL,
usr_img VARCHAR(100),
usr_refresh_token VARCHAR(250)
) ENGINE=INNODB;

The following statement creates a new table named projects and uses the usr_id as a foreign key to link the tb_users table with the tb_projects table:

CREATE TABLE IF NOT EXISTS tb_projects (
prj_id INT AUTO_INCREMENT PRIMARY KEY,
prj_num VARCHAR(20),
prj_ref_num VARCHAR(20),
prj_title VARCHAR(255) NOT NULL,
prj_status VARCHAR(20) NOT NULL,
prj_priority VARCHAR(20) NOT NULL,
prj_description TEXT NOT NULL,
prj_notes INT,
prj_usr_id INT,
prj_dt_created DATE DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d')),
prj_dt_assigned DATE,
prj_dt_due DATE,
prj_dt_completed DATE,
prj_createdby VARCHAR(50),
FOREIGN KEY (prj_usr_id)
REFERENCES tb_users (usr_id)
ON UPDATE RESTRICT ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS tb_notes (
nte_id INT AUTO_INCREMENT PRIMARY KEY,
nte_prj_id INT NOT NULL,
nte_note VARCHAR(255) NOT NULL,
nte_usr_id INT NOT NULL,
nte_date DATE NOT NULL DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d')),
FOREIGN KEY (nte_prj_id) REFERENCES tb_projects (prj_id),
FOREIGN KEY (nte_usr_id) REFERENCES tb_users (usr_id)
ON UPDATE RESTRICT ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS tb_edits (
edt_id INT AUTO_INCREMENT PRIMARY KEY,
edt_prj_id INT NOT NULL,
edt_usr_id INT NOT NULL,
edt_values LONGTEXT NOT NULL,
edt_date DATE NOT NULL DEFAULT (DATE_FORMAT(NOW(), '%Y-%m-%d')),
FOREIGN KEY (edt_prj_id) REFERENCES tb_projects (prj_id),
FOREIGN KEY (edt_usr_id) REFERENCES tb_users (usr_id)
ON UPDATE RESTRICT ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS tb_status (
sts_id INT AUTO_INCREMENT,
sts_description VARCHAR(255) NOT NULL,
sts_completed BOOLEAN NOT NULL DEFAULT FALSE,
sts_prj_id INT,
sts_usr_id INT,
PRIMARY KEY (sts_id , sts_prj_id, sts_usr_id ),
FOREIGN KEY (sts_prj_id)
REFERENCES tb_projects (prj_id),
FOREIGN KEY (sts_usr_id)
REFERENCES tb_users (usr_id)
ON UPDATE RESTRICT ON DELETE CASCADE
);

Insert a value into the USERS table the default
keyword is for the autoincrement and CURDATE enters the current date

LOCK TABLES `cpc_it`.`tb_users` WRITE;
INSERT INTO `cpc_it`.`tb_users` VALUES
(default,'testingpants','YIes88s','testingpants@gmail.com',1,CURDATE());
UNLOCK TABLES;

-- stored procedure - execute withing create procedure window
CREATE PROCEDURE `employee_db`.`usp_employee_add_or_edit` (
IN \_id INT,
IN \_name VARCHAR(45),
IN \_employee_code VARCHAR(45),
IN \_salary INT

)
BEGIN
IF \_id = 0 THEN
INSERT INTO employees(name,employee_code,salary)
VALUES (\_name,\_employee_code,\_salary);

    ELSE
    	UPDATE employees
        SET name = _name,
    	employee_code = _employee_code,
        salary = _salary
        WHERE id = _id;
    END IF;

    SELECT ROW_COUNT() AS 'affectedRows';

END
