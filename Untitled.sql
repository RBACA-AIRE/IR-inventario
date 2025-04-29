CREATE TABLE [follows] (
  [following_user_id] integer,
  [followed_user_id] integer,
  [created_at] timestamp
)
GO

CREATE TABLE [users] (
  [id] integer PRIMARY KEY,
  [username] nvarchar(255),
  [role] nvarchar(255),
  [created_at] timestamp
)
GO

CREATE TABLE [posts] (
  [id] integer PRIMARY KEY,
  [title] nvarchar(255),
  [body] text,
  [user_id] integer NOT NULL,
  [status] nvarchar(255),
  [created_at] timestamp
)
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'Content of the post',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'posts',
@level2type = N'Column', @level2name = 'body';
GO

ALTER TABLE [posts] ADD CONSTRAINT [user_posts] FOREIGN KEY ([user_id]) REFERENCES [users] ([id])
GO

ALTER TABLE [follows] ADD FOREIGN KEY ([following_user_id]) REFERENCES [users] ([id])
GO

ALTER TABLE [follows] ADD FOREIGN KEY ([followed_user_id]) REFERENCES [users] ([id])
GO
