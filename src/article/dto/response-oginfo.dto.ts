import { ApiProperty } from '@nestjs/swagger';

class OgImage {
  @ApiProperty({ nullable: true })
  url: string;

  @ApiProperty({ nullable: true })
  width: string;

  @ApiProperty({ nullable: true })
  height: string;

  @ApiProperty({ nullable: true })
  type: string;
}

export class OgInfoResponseDto {
  @ApiProperty({ nullable: true })
  ogDescription: string;

  @ApiProperty({ nullable: true })
  ogTitle: string;

  @ApiProperty({ nullable: true })
  ogUrl: string;

  ogImage: OgImage;

  @ApiProperty({ nullable: true })
  ogSiteName: string;

  @ApiProperty({ nullable: true })
  ogDate: Date;

  @ApiProperty({ nullable: true })
  success: boolean;

  constructor(property: {
    ogDescription: string;
    ogTitle: string;
    ogUrl: string;
    ogImage: any;
    ogSiteName: string;
    ogDate: Date;
    success: boolean;
  }) {
    this.ogDescription = property.ogDescription;
    this.ogTitle = property.ogTitle;
    this.ogUrl = property.ogUrl;
    this.ogImage = property.ogImage;
    this.ogSiteName = property.ogSiteName;
    this.ogDate = property.ogDate;
    this.success = property.success;
  }
}
