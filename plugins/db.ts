import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelAttributes,
  NonAttribute,
  Sequelize,
} from 'sequelize';

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class Artwork extends Model<
    InferAttributes<Artwork>,
    InferCreationAttributes<Artwork>
> {
  declare id: CreationOptional<number>;
  declare sourceName: string;
  declare sourceId: number;
  declare title: string;
  declare description: string | null;
  declare url: string | null;
  declare creditLine: string | null;
  declare date: string | null;
  declare origin: string | null;
  declare medium: string | null;
  declare images?: NonAttribute<Image[]>;
  declare getImages: HasManyGetAssociationsMixin<Image>;
  declare addImage: HasManyAddAssociationMixin<Image, number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class Image extends Model<
    InferAttributes<Image>,
    InferCreationAttributes<Image>
> {
  declare id: CreationOptional<number>;
  declare artworkId: ForeignKey<Artwork['id']>;
  declare artwork: NonAttribute<Artwork>;
  declare url: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export default defineNitroPlugin((nitro) => {
  const config = useRuntimeConfig();

  const sequelize = new Sequelize(config.databaseUrl);

  User.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING,
    },
    email: {
      type: new DataTypes.STRING,
      unique: true,
    },
    password: {
      type: new DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    tableName: 'users',
    sequelize,
  });

  Artwork.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    sourceName: {
      type: new DataTypes.STRING,
    },
    sourceId: {
      type: new DataTypes.INTEGER,
    },
    title: {
      type: new DataTypes.STRING,
    },
    description: {
      type: new DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: new DataTypes.STRING,
      allowNull: true,
    },
    creditLine: {
      type: new DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: new DataTypes.STRING,
      allowNull: true,
    },
    origin: {
      type: new DataTypes.STRING,
      allowNull: true,
    },
    medium: {
      type: new DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    tableName: 'artworks',
    sequelize,
  });

  Image.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: new DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    tableName: 'images',
    sequelize,
  });

  Artwork.hasMany(Image);
  Image.belongsTo(Artwork);

  sequelize.sync({
    alter: true,
  });

  nitro.hooks.hookOnce('close', async () => {
    sequelize.close();
  });
});
