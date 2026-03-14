import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from 'typeorm';

export class RenameListingImageListingId1710330000000
  implements MigrationInterface
{
  name = 'RenameListingImageListingId1710330000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    let table = await queryRunner.getTable('listing_images');
    if (!table) {
      return;
    }

    const legacyColumn = table.findColumnByName('listingId');
    const canonicalColumn = table.findColumnByName('listing_id');

    if (legacyColumn && !canonicalColumn) {
      await queryRunner.renameColumn('listing_images', 'listingId', 'listing_id');
      table = await queryRunner.getTable('listing_images');
    }

    if (!table) {
      return;
    }

    if (!table.findColumnByName('is_primary')) {
      await queryRunner.addColumn(
        'listing_images',
        new TableColumn({
          name: 'is_primary',
          type: 'boolean',
          isNullable: false,
          default: false,
        }),
      );
    }

    await queryRunner.query(`
      WITH ranked AS (
        SELECT
          id,
          ROW_NUMBER() OVER (
            PARTITION BY listing_id
            ORDER BY sort_order ASC, id ASC
          ) AS rn
        FROM listing_images
      )
      UPDATE listing_images li
      SET is_primary = ranked.rn = 1
      FROM ranked
      WHERE li.id = ranked.id
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    let table = await queryRunner.getTable('listing_images');
    if (!table) {
      return;
    }

    if (table.findColumnByName('is_primary')) {
      await queryRunner.dropColumn('listing_images', 'is_primary');
      table = await queryRunner.getTable('listing_images');
    }

    if (table?.findColumnByName('listing_id') && !table.findColumnByName('listingId')) {
      await queryRunner.renameColumn('listing_images', 'listing_id', 'listingId');
    }
  }
}
