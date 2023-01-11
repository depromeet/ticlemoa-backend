import { IsBoolean, IsDate, IsObject, IsString } from 'class-validator';

export class OgInfoResponseDto {
  @IsString()
  ogDescription: string;

  @IsString()
  ogTitle: string;

  @IsString()
  ogUrl: string;

  @IsObject()
  ogImage: object;

  @IsString()
  ogSiteName: string;

  @IsDate()
  ogDate: Date;

  @IsBoolean()
  success: boolean;

  constructor(property: {
    ogDescription: string;
    ogTitle: string;
    ogUrl: string;
    ogImage: object;
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
