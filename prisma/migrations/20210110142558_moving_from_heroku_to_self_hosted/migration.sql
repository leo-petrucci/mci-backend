-- CreateTable
CREATE TABLE "Server" (
"id" SERIAL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cover" TEXT,
    "slots" INTEGER NOT NULL,
    "ip" TEXT NOT NULL DEFAULT E'',
    "authorId" INTEGER NOT NULL,
    "versionId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL DEFAULT E'',
    "posts" INTEGER NOT NULL DEFAULT 0,
    "banned" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
"id" SERIAL,
    "tagName" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,
    "serverId" INTEGER NOT NULL,

    PRIMARY KEY ("createdAt")
);

-- CreateTable
CREATE TABLE "Version" (
"id" SERIAL,
    "versionName" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ServerToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tag.tagName_unique" ON "Tag"("tagName");

-- CreateIndex
CREATE UNIQUE INDEX "Vote.id_unique" ON "Vote"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Version.versionName_unique" ON "Version"("versionName");

-- CreateIndex
CREATE UNIQUE INDEX "_ServerToTag_AB_unique" ON "_ServerToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ServerToTag_B_index" ON "_ServerToTag"("B");

-- AddForeignKey
ALTER TABLE "Server" ADD FOREIGN KEY("authorId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Server" ADD FOREIGN KEY("versionId")REFERENCES "Version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY("authorId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY("serverId")REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServerToTag" ADD FOREIGN KEY("A")REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServerToTag" ADD FOREIGN KEY("B")REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
