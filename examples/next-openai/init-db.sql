-- Initialize profiletailor database for GRC (Governance, Risk & Compliance) system
USE master;
GO

-- Create the profiletailor database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'profiletailor')
BEGIN
    PRINT 'Creating profiletailor database...';
    CREATE DATABASE profiletailor;
    PRINT 'Database profiletailor created successfully.';
END
ELSE
BEGIN
    PRINT 'Database profiletailor already exists.';
END
GO

-- Switch to the profiletailor database
USE profiletailor;
GO

