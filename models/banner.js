module.exports = (sequelize, DataTypes) => {
    const banner = sequelize.define('Banner', {
        imageUrl: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },
    });
    return banner;
}