-- 1) Insert
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- 2) Update
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- 3)Delete
DELETE FROM account
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- 4) Replace
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- 5) Join
SELECT inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM inventory
    LEFT JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';
--6) Update/replace
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');